import {Constraint} from './constraint';
import {TrialVisit} from '../trial-visit';

export class TrialVisitConstraint implements Constraint {

  private _parent: Constraint;
  private _trialVisits: TrialVisit[];
  private _isPatientSelection: boolean;


  constructor() {
    this.parent = null;
    this.trialVisits = [];
  }

  getClassName(): string {
    return 'TrialVisitConstraint';
  }

  toPatientQueryObject(): Object {
    // TODO: implement the 'subselection' wrapper on a normal query object
    return null;
  }

  /** Builds a query object for the date constraint.
   * @returns {Object}
   */
  toQueryObject(): Object {
    if (this.isPatientSelection) {
      return this.toPatientQueryObject();
    } else {
      let values: number[] = [];
      for (let visit of this.trialVisits) {
        values.push(Number(visit.id));
      }
      let queryObj = {
        'type': 'field',
        'field': {
          'dimension': 'trial visit',
          'fieldName': 'id',
          'type': 'NUMERIC'
        },
        'operator': 'in',
        'value': values
      };

      return queryObj;
    }
  }

  get textRepresentation(): string {
    return 'Trial visit constraint';
  }

  get trialVisits(): TrialVisit[] {
    return this._trialVisits;
  }

  set trialVisits(value: TrialVisit[]) {
    this._trialVisits = value;
  }

  get isPatientSelection(): boolean {
    return this._isPatientSelection;
  }

  set isPatientSelection(value: boolean) {
    this._isPatientSelection = value;
  }

  get parent(): Constraint {
    return this._parent;
  }

  set parent(value: Constraint) {
    this._parent = value;
  }
}
