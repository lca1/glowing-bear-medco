/**
 * Copyright 2020 CHUV
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Granularity } from './granularity-type';

export class SurvivalSettings {
  constructor(
    public timeGranularity: Granularity,
    public timeLimit: number,
    public startEvent: string,
    public startModifier: string,
    public endEvent: string,
    public endModifier: string,
    public subGroupTextRepresentations: {
      groupId: string,
      rootInclusionConstraint?: string,
      rootExclusionConstraint?: string
    }[]
  ) { }

  mainSettingsToTable(): { headers: string[][], data: string[][] } {
    let headers = [['Name', 'Value']]
    let data = new Array<string[]>(6)
    data[0] = ['time granularity', `${this.timeGranularity}`]
    data[1] = ['time limit (in unit defined in granularity)', `${this.timeLimit}`]
    data[2] = ['start event', `${this.startEvent}`]
    data[3] = ['end event', `${this.endEvent}`]
    data[4] = ['start modifier', `${this.startModifier}`]
    data[5] = ['end modifier', `${this.startModifier}`]

    return { headers: headers, data: data }
  }

  subGroupsToTable(): { headers: string[][], data: string[][] } {
    let headers = [['Group', 'Inclusion/Exclusion', 'Definition']]
    let data = new Array<string[]>()
    this.subGroupTextRepresentations.forEach(
      sg => {
        if (sg.rootInclusionConstraint) {
          data.push([sg.groupId, 'inclusion', sg.rootInclusionConstraint])
          if (sg.rootExclusionConstraint) {
            data.push(['', 'exclusion', sg.rootExclusionConstraint])
          }
        } else if (sg.rootExclusionConstraint) {
          data.push([sg.groupId, 'exclusion', sg.rootExclusionConstraint])
        } else {
          console.log(`in formatting sub-group definitions: sub-group ${sg.groupId} has no definition ` +
            '(neither inclusion nor exclusion). This is not supposed to happen.')
        }
      }
    )

    return { headers: headers, data }

  }

}