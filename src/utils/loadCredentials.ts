interface Credentials {
  serverURL: string;
  username: string;
  password: string;
  apiKey: string;
}

const credentials: Credentials = {
  serverURL: process.env.API_SERVER_URL!,
  username: process.env.API_USERNAME!,
  password: process.env.API_PASSWORD!,
  apiKey: process.env.API_KEY!,
};

export default credentials;
