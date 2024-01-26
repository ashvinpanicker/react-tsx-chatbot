interface Credentials {
  serverURL: string;
  username: string;
  password: string;
  apiKey: string;
}

const credentials: Credentials = {
  serverURL: process.env.REACT_APP_API_SERVER_URL!,
  username: process.env.REACT_APP_API_USERNAME!,
  password: process.env.REACT_APP_API_PASSWORD!,
  apiKey: process.env.REACT_APP_API_KEY!,
};

export default credentials;
