import {
  createNewUserByGithub,
  getGitHubUserByID,
  getUserByID,
  isUniqueUsername,
} from "@/lib/db"
import { setSessionLogInID } from "@/lib/session"
import { getAccessToken, getUserProfile } from "@/lib/utils"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // 1. github이 준 파라미터 code를 가져옴
  // 2. 코드가 없으면 에러
  // 3. 3-1. github/start 에서 "https://github.com/login/oauth/authorize"에 client_id를 실어보냄
  //    3-2. github/complete 로 code 파라미터 실어서 응답 보내줌
  //    3-3. "https://github.com/login/oauth/access_token" 에 POST/json로 client_id, client_secret 실어보냄
  //    3-4. userProfile 얻음
  //      -----------username 중복 체크----------------
  //      --------------------------------------------
  //    3-5. userEmail 얻음
  const access_token = await getAccessToken(request)
  const userProfile = await getUserProfile(request, access_token)
  const { id, avatar_url, login, email } = userProfile
  //const githubEmailID = email ? String(email).split("@")[0] : null
  const user = await getGitHubUserByID(id)
  if (user) {
    await setSessionLogInID(user.id, "/profile")
  } else {
    // todo : username은 필수 항목인데 새사용자 생성시 같은이름이 존재할 때 처리필요
    const isNewUser = await isUniqueUsername(login)
    //
    if (isNewUser) {
      const newUser = await createNewUserByGithub(login, id, avatar_url, email)
      await setSessionLogInID(newUser.id, "/profile")
    } else {
      const newGitHubUsername = `${login}_gh`
      const newUser = await createNewUserByGithub(
        newGitHubUsername,
        id,
        avatar_url,
        email
      )
      await setSessionLogInID(newUser.id, "/profile")
    }
  }
}
