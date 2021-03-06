import axios from 'axios';
import Users from '../src/user';

// mock axios 模块
jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))
  // promise use return
  return Users.all().then(data => expect(data).toEqual(users));
});