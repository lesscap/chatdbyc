import * as pathUtil from 'path'

export const config = {
  session: {
    secret: 'YV-OwxHoE-A4IpZ-JvpziuXfQNk0tY02A1UlNm3OwMk9BICSPzmgODxa9nuUBeh8',
  },
  openaiApiKey: process.env.OPENAI_API_KEY,
  staticRoot: pathUtil.join(__dirname, '../../public'),
}
