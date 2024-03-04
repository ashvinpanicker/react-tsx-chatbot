// api.ts
import credentials from './loadCredentials';
import extractTags from './extractTags';

/* All responses from server are (usually) of the below format:
  {
    success: boolean,
    message: string,
    data: object
  }
*/

/**
 * Ping the server to check its availability.
 * @returns {Promise<boolean>} A boolean indicating the success of the ping request.
 */
export const pingServer = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${credentials.serverURL}/ping`, {
      method: 'GET',
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Ping Server failed', response);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to Server:', error);
    return false;
  }
};

interface LoginResponse {
  userId: string;
  customerId: number;
  idleTimeoutSeconds?: number;
  sessionTimeoutSeconds?: number;
  botIntroMessage?: string;
  botIntroSuggestions?: string[];
}

/**
 * Log in to the server using provided credentials.
 * @returns {Promise<LoginResponse | null>} An object containing login information if successful, otherwise null.
 */
export const loginEndpoint = async (): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${credentials.serverURL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.apiKey}`,
      }),
    });

    if (response.ok) {
      const { data } = await response.json();
      return {
        userId: data.user_id,
        customerId: data.customer_id,
        idleTimeoutSeconds: data.idle_timeout_seconds,
        sessionTimeoutSeconds: data.session_timeout_seconds,
        botIntroMessage: data.bot_intro_message,
        botIntroSuggestions: data.bot_intro_suggestions,
      };
    } else {
      console.error('Login failed');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export interface RefreshTokenResponse {
  userId: string;
}

/**
 * Refresh the authentication token.
 * @returns {Promise<RefreshTokenResponse | null>} An object containing refreshed token information if successful, otherwise null.
 */
export const refreshTokenEndpoint = async (): Promise<RefreshTokenResponse | null> => {
  try {
    // Make a request to refresh the token
    const refreshResponse = await fetch(`${credentials.serverURL}/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        Authorization: `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      }),
    });

    if (refreshResponse.ok) {
      const { data } = await refreshResponse.json();
      return { userId: data.user_id };
    } else {
      console.error('Token refresh failed');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

/**
 * Ask a question to the server.
 * @param {string} question - The question to ask.
 * @param {Function} cb - Callback function
 * @returns {Promise<string>} The answer to the question.
 */
export const askEndpoint = async (question: string, cb: Function): Promise<any> => {
  try {
    const response = await fetch(`${credentials.serverURL}/ask`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (response) {
      const jsonResponse = await response.json();
      // HTTP 200
      if (response.ok) {
        // Check answer for tags
        const tagsData = extractTags(jsonResponse.data.answer);
        console.log('Tags Found: ', tagsData);
        const interestedTags = tagsData.filter((d) => d.tag == 'interest');
        if (interestedTags.length > 0) {
          // Interest Tag found
          console.log('User is interested in -> ', interestedTags);
          cb(interestedTags[0].content);
        }
        return jsonResponse.data.answer_without_tags;
      } else {
        console.error('Ask endpoint failed', jsonResponse);
        return jsonResponse.message;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error}`;
  }
};

/**
 * Logout the user from the server.
 * @returns {Promise<string>} A message indicating the success or failure of the logout operation.
 */
export const logoutEndpoint = async () => {
  try {
    const response = await fetch(`${credentials.serverURL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        Authorization: `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      }),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.message;
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error:', error);
    return `Error while logging out: ${error}`;
  }
};
