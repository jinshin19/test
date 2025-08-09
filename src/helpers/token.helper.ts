import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const { TokenExpiredError, JsonWebTokenError } = jwt;

const customSuccess = (token_type: TokenTypeE, data: any): CustomReturnI => {
  return {
    status_type: StatusTypeE.SUCCESS,
    token_type,
    data,
    message: null,
  };
};

const customError = (): CustomReturnI => {
  return {
    status_type: StatusTypeE.ERROR,
    token_type: null,
    data: null,
    message: null,
  };
};

export const generateAccessToken = (data: any): string => {
  const token = jwt.sign(data, process.env.REACT_FOOD_BACKEND_JWT_SECRET!, {
    expiresIn: "5m",
  });
  return token;
};

export const generateRefreshToken = (data: any): string => {
  const token = jwt.sign(data, process.env.REACT_FOOD_BACKEND_JWT_SECRET!, {
    expiresIn: "10m",
  });
  return token;
};

export const validateToken = (
  token_type: TokenTypeE,
  token: string
): CustomReturnI => {
  const validatedToken = jwt.verify(
    token,
    process.env.REACT_FOOD_BACKEND_JWT_SECRET!
  );
  if (
    validatedToken instanceof TokenExpiredError ||
    validatedToken instanceof JsonWebTokenError
  ) {
    return customError();
  }
  return customSuccess(token_type, token);
};

export const validateTokens = (accessToken: string, refreshToken: string) => {
  if (!accessToken && !refreshToken) {
    return customError();
  } else {
    if (accessToken && !refreshToken) {
      const validatedAccessToken = validateToken(
        TokenTypeE.ACCESS_TOKEN,
        accessToken
      );
      return validatedAccessToken;
    }
    if (!accessToken && refreshToken) {
      const validatedRefreshToken = validateToken(
        TokenTypeE.REFRESH_TOKEN,
        refreshToken
      );
      if (validatedRefreshToken.status_type === StatusTypeE.ERROR) {
        return validatedRefreshToken;
      } else {
        const generatedAccessToken = generateAccessToken(
          validatedRefreshToken.data
        );
        return customSuccess(TokenTypeE.ACCESS_TOKEN, generatedAccessToken);
      }
    }
    const validatedAccessToken = validateToken(
      TokenTypeE.ACCESS_TOKEN,
      accessToken
    );
    if (validatedAccessToken.status_type === StatusTypeE.SUCCESS) {
      return validatedAccessToken;
    }
    const validatedRefreshToken = validateToken(
      TokenTypeE.ACCESS_TOKEN,
      accessToken
    );
    if (validatedRefreshToken.status_type === StatusTypeE.SUCCESS) {
      const generatedAccessToken = generateAccessToken(
        validatedRefreshToken.data
      );
      return customSuccess(TokenTypeE.ACCESS_TOKEN, generatedAccessToken);
    }
    return customError();
  }
};

enum TokenTypeE {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

enum StatusTypeE {
  SUCCESS = "success",
  ERROR = "error",
}

interface CustomReturnI {
  status_type: StatusTypeE;
  token_type: TokenTypeE | null;
  data: any | null;
  message: any | null;
}

interface CustomJwtVerifiedPayload {}
