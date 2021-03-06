/**
 * Copyright 2020 CHUV
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CombinationConstraint } from './combination-constraint';
import { Concept } from './concept';
import { Constraint } from './constraint';
import { GenomicAnnotation } from './genomic-annotation';

class ConstraintStorage {
  private _rootInclusionConstraint: CombinationConstraint;
  private _rootExclusionConstraint: CombinationConstraint;

  /*
   * List keeping track of all available constraints.
   * By default, the empty, constraints are in here.
   * In addition, (partially) filled constraints are added.
   * The constraints should be copied when editing them.
   */
  private _allConstraints: Constraint[] = [];
  private _concepts: Concept[] = [];
  private _conceptLabels: string[] = [];
  private _conceptConstraints: Constraint[] = [];
  private _genomicAnnotations: GenomicAnnotation[] = [];

  /*
   * The maximum number of search results allowed when searching for a constraint
   */
  private _maxNumSearchResults = 100;

  private constructor(
    rootInclusionConstraint: CombinationConstraint,
    rootExclusionConstraint: CombinationConstraint,
    allConstraints: Constraint[],
    concepts: Concept[],
    conceptLabels: string[],
    conceptConstraints: Constraint[],
    genomicAnnotations: GenomicAnnotation[]
  ) {
    this._allConstraints = allConstraints.map(constraint => constraint.clone())
    this._conceptLabels = conceptLabels.map(x => x)

  }
}
