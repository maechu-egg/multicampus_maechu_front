// AuthContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// 상태의 타입 정의
interface AuthState {
  token: string | null; // 토큰은 문자열 또는 null일 수 있음
}

// 액션의 타입 정의
interface AuthAction {
  type: "LOGIN" | "LOGOUT"; // 가능한 액션 타입
  payload?: string; // LOGIN 액션의 경우 payload가 문자열일 수 있음
}

// 인증상태의 초기값을 정의 : 로컬스토리지에서 authToken 키로 저장된 값을 가져오고 없으면 null 설정
const initialState: AuthState = {
  token: localStorage.getItem("authToken") || null, // 로컬 스토리지에서 토큰 가져오기
};

// 상태를 업데이트하는 리듀서 함수 : state, action을 받아서 상태 반환
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN": //로그인 시 액션의 payload를 토큰으로 설정
      return { ...state, token: action.payload || null }; // payload가 없을 경우 null로 설정
    case "LOGOUT": //로그아웃 시 토큰을 null 설정
      return { ...state, token: null };
    default:
      return state;
  }
};

// Context 생성
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null); // Context의 타입 정의

// AuthProvider 컴포넌트 정의
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // 토큰이 변경될 때마다 로컬 스토리지에 저장
    if (state.token) {
      localStorage.setItem("authToken", state.token);
    } else {
      localStorage.removeItem("authToken"); // 로그아웃 시 로컬 스토리지에서 제거
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅 정의
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
