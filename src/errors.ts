// 공통 베이스 에러
export abstract class BaseError<T = any> extends Error {
  // 각 에러별로 errorCode는 하위 클래스에서 설정
  abstract errorCode: string;

  reason: string;
  data: T | null;

  constructor(reason: string, data?: T) {
    super(reason);

    // Error 상속 시 instanceof 깨지는 문제 방지
    Object.setPrototypeOf(this, new.target.prototype);

    this.reason = reason;
    this.data = data ?? null;
    this.name = new.target.name;
  }
}

export class DuplicateUserEmailError extends BaseError {
  errorCode = "U001";

  constructor(reason: string, data?: any) {
    super(reason, data);
  }
}

export class MissionNotFoundError extends BaseError {
  errorCode = "M001";

  constructor(reason: string = "미션을 찾을 수 없습니다.", data?: any) {
    super(reason, data);
  }
}

export class UserMissionNotFoundError extends BaseError {
  errorCode = "UM001";

  constructor(reason: string = "사용자 미션을 찾을 수 없습니다.", data?: any) {
    super(reason, data);
  }
}

export class ReviewAlreadyExistsError extends BaseError {
  errorCode = "R001";

  constructor(reason: string = "이미 작성된 리뷰가 있습니다.", data?: any) {
    super(reason, data);
  }
}

export class UnauthorizedError extends BaseError {
  errorCode = "AUTH001";

  constructor(reason: string = "권한이 없습니다.", data?: any) {
    super(reason, data);
  }
}

export class InvalidStatusError extends BaseError {
  errorCode = "STATUS001";

  constructor(reason: string = "유효하지 않은 상태입니다.", data?: any) {
    super(reason, data);
  }
}

export class AlreadyAssignedError extends BaseError {
  errorCode = "M002";

  constructor(reason: string = "이미 할당된 미션입니다.", data?: any) {
    super(reason, data);
  }
}

export class StoreMismatchError extends BaseError {
  errorCode = "M003";

  constructor(
    reason: string = "이 미션은 해당 매장과 일치하지 않습니다.",
    data?: any
  ) {
    super(reason, data);
  }
}

export class InvalidParameterError extends BaseError {
  errorCode = "INVALID_PARAMS";

  constructor(reason: string = "유효하지 않은 파라미터입니다.", data?: any) {
    super(reason, data);
  }
}

export class ValidationError extends BaseError {
  errorCode = "VALIDATION_ERROR";

  constructor(reason: string, data?: any) {
    super(reason, data);
  }
}
