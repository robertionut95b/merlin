export interface RecurringEventProps {
  title: string;
  groupId: string;
  daysOfWeek: number[];
  startTime?: string;
  endTime?: string;
  startRecur?: Date;
  endRecur?: Date;
}

export interface RecurringEvent {
  toRecurringEvent(): RecurringEventProps;
}

class CalendarEvent implements RecurringEvent {
  private _title: string;
  private _groupid: string;
  private _daysOfWeek: number[];
  private _startTime: string;
  private _endTime: string;
  private _startRecur: Date;
  private _endRecur: Date;

  constructor(
    title: string,
    groupid: string,
    daysOfWeek: number[],
    startTime: string,
    endTime: string,
    startRecur: Date,
    endRecur: Date
  ) {
    this._title = title;
    this._groupid = groupid;
    this._daysOfWeek = daysOfWeek;
    this._startTime = startTime;
    this._endTime = endTime;
    this._startRecur = startRecur;
    this._endRecur = endRecur;
  }

  public toRecurringEvent(): RecurringEventProps {
    return {
      title: this._title,
      groupId: this._groupid,
      daysOfWeek: this._daysOfWeek,
      startTime: this._startTime,
      endTime: this._endTime,
      startRecur: this._startRecur,
      endRecur: this._endRecur,
    };
  }
}

export const dayStringToNumber = (day: string): number => {
  switch (day) {
    case "Sunday":
      return 0;
    case "Monday":
      return 1;
    case "Tuesday":
      return 2;
    case "Wednesday":
      return 3;
    case "Thursday":
      return 4;
    case "Friday":
      return 5;
    case "Saturday":
      return 6;
    default:
      return -1;
  }
};
