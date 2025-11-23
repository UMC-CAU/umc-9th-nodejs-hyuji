export class DuplicateUserEmailError extends Error {
  errorCode: string = "U001";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class MissionNotFoundError extends Error {
  errorCode: string = "M001";
  reason: string;
  data: any;

  constructor(reason: string = "미션을 찾을 수 없습니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class UserMissionNotFoundError extends Error {
  errorCode: string = "UM001";
  reason: string;
  data: any;

  constructor(reason: string = "사용자 미션을 찾을 수 없습니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class ReviewAlreadyExistsError extends Error {
  errorCode: string = "R001";
  reason: string;
  data: any;

  constructor(reason: string = "이미 작성된 리뷰가 있습니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class UnauthorizedError extends Error {
  errorCode: string = "AUTH001";
  reason: string;
  data: any;

  constructor(reason: string = "권한이 없습니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class InvalidStatusError extends Error {
  errorCode: string = "STATUS001";
  reason: string;
  data: any;

  constructor(reason: string = "유효하지 않은 상태입니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class AlreadyAssignedError extends Error {
  errorCode: string = "M002";
  reason: string;
  data: any;

  constructor(reason: string = "이미 할당된 미션입니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class StoreMismatchError extends Error {
  errorCode: string = "M003";
  reason: string;
  data: any;

  constructor(reason: string = "이 미션은 해당 매장과 일치하지 않습니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class InvalidParameterError extends Error {
  errorCode: string = "INVALID_PARAMS";
  reason: string;
  data: any;

  constructor(reason: string = "유효하지 않은 파라미터입니다.", data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}

export class ValidationError extends Error {
  errorCode: string = "VALIDATION_ERROR";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data ?? null;
  }
}