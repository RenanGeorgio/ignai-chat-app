import { baseUrl, postRequest } from "../services/apiService";

export const createChat = async ({ firstId, secondId }) => {
  const response = postRequest(baseUrl + '/api/chat',
    {
      firstId,
      secondId,
      origin: {
        platform: "web"
      }
    }
  )

  if (response) {
    return response;
  }
}