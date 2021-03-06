/**
 * Copyright 2020 CHUV
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { SubGroup, SurvivalService } from '../../../../services/survival-analysis.service';
import { AnalysisService } from '../../../../services/analysis.service';
import { ConstraintService } from '../../../../services/constraint.service';
import { MessageHelper } from '../../../../utilities/message-helper';
import { OperationType } from '../../../../models/operation-models/operation-types';
import { CohortService } from '../../../../services/cohort.service';
import { ApiI2b2Timing } from '../../../../models/api-request-models/medco-node/api-i2b2-timing';
import { QueryService } from '../../../../services/query.service';

const nameMaxLength = 12

@Component({
  selector: 'gb-cohort-landing-zone',
  templateUrl: './gb-cohort-landing-zone.component.html',
  styleUrls: ['./gb-cohort-landing-zone.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GbCohortLandingZoneComponent implements OnInit {

  _activated: boolean
  _subGroups: SelectItem[]
  _name = ''
  _selectedSubGroup: SubGroup
  _usedNames: Set<string>

  OperationType = OperationType

  constructor(private analysisService: AnalysisService,
    private cohortService: CohortService,
    private constraintService: ConstraintService,
    private queryService: QueryService,
    private survivalService: SurvivalService) {
    this._subGroups = new Array()
    this._usedNames = new Set()

  }


  ngOnInit() {

    // reload existing subgroups from previous analysis
    this._subGroups = this.survivalService.subGroups.map(sg => { return { label: sg.name, value: sg } })
  }

  @Input()
  set activated(a: boolean) {
    this._activated = a
  }

  get activated(): boolean {
    return this._activated
  }

  get expanded(): boolean {
    return this.analysisService.survivalSubGroupExpanded
  }

  set expanded(val: boolean) {
    this.analysisService.survivalSubGroupExpanded = val
  }


  get subGroups(): SelectItem[] {
    return this._subGroups
  }

  set selectedSubGroup(rootConstraints: SubGroup) {
    this._selectedSubGroup = rootConstraints
  }

  get selectedSubGroup(): SubGroup {
    return this._selectedSubGroup
  }

  set name(n: string) {
    this._name = n
  }

  get name(): string {
    return this._name
  }

  addSubGroup(event: Event) {

    if (this.name === '') {
      MessageHelper.alert('error', 'Subgroup name cannot be empty')
      return
    }
    if (this._usedNames.has(this.name)) {
      MessageHelper.alert('error', `Subgroup name ${this.name} already used`)
      return
    }
    if (!this.cohortService.patternValidation.test(this.name).valueOf()) {
      MessageHelper.alert('error', `Subgroup name ${this.name} can only contain alphanumerical symbols (without ö é ç ...) and underscores "_"`)
      return
    }
    if (this.name.length === nameMaxLength) {
      MessageHelper.alert('error', `Subgroup name length cannot exceed ${nameMaxLength}`)
      return
    }
    if (!this.constraintService.hasExclusionConstraint() && !this.constraintService.hasInclusionConstraint()) {
      MessageHelper.alert('error', 'Both inclusion and exclusion constraints are empty, nothing to add')
      return
    }

    let newSubGroup: SubGroup = {
      name: this.name,
      timing: this.queryService.queryTimingSameInstance ? ApiI2b2Timing.sameInstanceNum : ApiI2b2Timing.any,
      rootInclusionConstraint: this.constraintService.rootInclusionConstraint.clone(),
      rootExclusionConstraint: this.constraintService.rootExclusionConstraint.clone()
    }
    this.subGroups.push({ label: this.name, value: newSubGroup })
    this._usedNames.add(this.name)
    this.clearName()
    this.constraintService.clearConstraint()

    this.survivalService.subGroups = this.subGroups.map(({ value }) => value as SubGroup)
    this.selectedSubGroup = null

  }

  removeSubGroup(event: Event) {
    let nameToRemove = this.selectedSubGroup.name
    this._usedNames.delete(this._selectedSubGroup.name)
    this.selectedSubGroup = null
    this._subGroups = this.subGroups.filter(({ label }) => label !== nameToRemove)
    this.survivalService.subGroups = this.subGroups.map(({ value }) => value as SubGroup)
  }

  loadSubGroup(event: Event) {
    this.name = this.selectedSubGroup.name
    this.queryService.queryTimingSameInstance = (this.selectedSubGroup.timing === ApiI2b2Timing.sameInstanceNum) ? true : false
    this.constraintService.rootInclusionConstraint = this.selectedSubGroup.rootInclusionConstraint.clone()
    this.constraintService.rootExclusionConstraint = this.selectedSubGroup.rootExclusionConstraint.clone()
  }

  clearName() {
    this._name = ''
  }

  // otherwise it writes data in input field
  preventDefault(event: Event) {
    event.preventDefault()
  }

  reset() {
    this._subGroups = new Array()
    this._usedNames = new Set()
    this.clearName()
    this.constraintService.clearConstraint()
    this.queryService.clearAll()
  }

}
