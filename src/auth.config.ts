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

// 👉 우리 서비스에서 쓸 공통 유저 타입 (PK: userId)
export interface TokenUser {
  userId: number;
  email: string;
  name?: string | null;
}

// Access / Refresh 토큰 생성 헬퍼
export const generateAccessToken = (user: TokenUser): string => {
  return jwt.sign(
    {
      userId: user.userId, // ✅ userId 로 통일
      email: user.email,
    },
    JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (
  user: Pick<TokenUser, "userId">
): string => {
  return jwt.sign(
    {
      userId: user.userId, // ✅ userId 로 통일
    },
    JWT_SECRET as string,
    { expiresIn: "14d" }
  );
};

// Google 계정 기반으로 우리 DB User 조회/생성
const googleVerify = async (profile: Profile): Promise<TokenUser> => {
  const email = profile.emails?.[0]?.value;

  if (!email) {
    throw new Error(
      `profile.email was not found: ${JSON.stringify({
        id: profile.id,
        displayName: profile.displayName,
      })}`
    );
  }

  const existing = await prisma.user.findFirst({
    where: { email },
    select: {
      userId: true,
      email: true,
      name: true,
      provider: true,
    },
  });

  if (existing) {
    return {
      userId: existing.userId,
      email: existing.email,
      name: existing.name,
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
    userId: created.userId,
    email: created.email,
    name: created.name,
  };
};

// GoogleStrategy: ✅ 유저 정보만 req.user 로 넘김
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
      // 여기서는 토큰 만들지 않고, 유저만 넘김
      done(null, user);
    } catch (err) {
      done(err as Error);
    }
  }
);

// JWT payload 타입
interface JwtPayload {
  userId: number;
  email?: string;
  iat?: number;
  exp?: number;
}

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET as string,
};

export const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload: JwtPayload, done) => {
    try {
      const userId = payload.userId;

      if (!userId) {
        return done(new Error("토큰에 userId가 없습니다."), false);
      }

      const user = await prisma.user.findUnique({
        where: { userId },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err as Error, false);
    }
  }
);
