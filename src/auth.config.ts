import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { prisma } from "./db.config";

dotenv.config();

const {
  JWT_SECRET,
  PASSPORT_GOOGLE_CLIENT_ID,
  PASSPORT_GOOGLE_CLIENT_SECRET,
} = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
if (!PASSPORT_GOOGLE_CLIENT_ID || !PASSPORT_GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth env vars are not defined");
}

// 토큰에 넣을 사용자 타입 정의
interface TokenUser {
  id: number;
  email: string;
}

export const generateAccessToken = (user: TokenUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET, // string으로 잘 추론됨
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (
  user: Pick<TokenUser, "id">
): string => {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: "14d" }
  );
};

// JWT에 넣을 유저 타입 (앞에서 만든 TokenUser와 호환)
interface OAuthUser {
  id: number;
  email: string;
  name?: string | null;
}

// Google 계정 검증 + 우리 DB User 모델에 맞게 조회/생성
const googleVerify = async (profile: Profile): Promise<OAuthUser> => {
  const email = profile.emails?.[0]?.value;

  if (!email) {
    throw new Error(
      `profile.email was not found: ${JSON.stringify({
        id: profile.id,
        displayName: profile.displayName,
      })}`
    );
  }

  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      userId: true,
      email: true,
      name: true,
      provider: true,
    },
  });

  if (user !== null) {
    return {
      id: user.userId, // userId → JWT용 id
      email: user.email,
      name: user.name,
    };
  }

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName ?? null,
      provider: "GOOGLE",
    },
    select: {
      userId: true,
      email: true,
      name: true,
    },
  });

  return {
    id: created.userId,
    email: created.email,
    name: created.name,
  };
};

// GoogleStrategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> => {
    try {
      const user = await googleVerify(profile);

      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      done(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      done(err as Error);
    }
  }
);

// AccessToken에 들어있는 payload 타입
interface JwtPayload {
  id: number;      // generateAccessToken에서 넣은 id
  email?: string;  // 옵션
  iat?: number;
  exp?: number;
}

const jwtOptions: StrategyOptions = {
  // 요청 헤더의 'Authorization: Bearer <token>' 에서 토큰 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload: JwtPayload, done) => {
    try {
      // Prisma 스키마 기준 PK는 userId
      const user = await prisma.user.findUnique({
        where: { userId: payload.id },
      });

      if (user) {
        return done(null, user); // req.user에 user 객체 세팅
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err as Error, false);
    }
  }
);
