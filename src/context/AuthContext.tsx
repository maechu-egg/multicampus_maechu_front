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
  memberId: number | null; // memberId는 숫자 또는 null일 수 있음
}

// 액션의 타입 정의
interface AuthAction {
  type: "LOGIN" | "LOGOUT"; // 가능한 액션 타입
  payload?: { token: string; memberId: number }; // LOGIN 액션의 경우 payload가 객체일 수 있음
}

// 초기 상태 정의
const initialState: AuthState = {
  token: localStorage.getItem("authToken") || null, // 로컬 스토리지에서 토큰 가져오기
  memberId: localStorage.getItem("memberId")
    ? parseInt(localStorage.getItem("memberId")!)
    : null, // 로컬 스토리지에서 memberId 가져오기
};

// 리듀서 함수 정의
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload?.token || null,
        memberId: action.payload?.memberId || null,
      }; // payload에서 token과 memberId 설정
    case "LOGOUT":
      return { token: null, memberId: null }; // 로그아웃 시 초기화
    default:
      return state;
  }
};

// Context 생성
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  logout: () => void; // logout 함수 추가
} | null>(null); // Context의 타입 정의

// AuthProvider 컴포넌트 정의
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // 토큰과 memberId가 변경될 때마다 로컬 스토리지에 저장
    if (state.token) {
      localStorage.setItem("authToken", state.token);
    } else {
      localStorage.removeItem("authToken"); // 로그아웃 시 로컬 스토리지에서 제거
    }

    if (state.memberId !== null) {
      localStorage.setItem("memberId", state.memberId.toString()); // memberId를 문자열로 저장
    } else {
      localStorage.removeItem("memberId"); // 로그아웃 시 로컬 스토리지에서 제거
    }

    // 상태가 변경될 때마다 콘솔에 출력
    console.log("현재 상태:", state); // 상태 출력
  }, [state.token, state.memberId]); // token과 memberId가 변경될 때마다 실행

  // 로그아웃 함수 추가
  const logout = () => {
    dispatch({ type: "LOGOUT" }); // 로그아웃 액션 디스패치
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
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
