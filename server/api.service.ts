import axios from 'axios';
class APIService {
  isUserExist: boolean = false;

  constructor() {
    // this was why the if in create user didnt wo kso for now in
    // here i write it as localhost:serverport then leter change it again so it not harcoded
    //
    axios.defaults.baseURL = `http://localhost:3004`;
  }

  async createUser(id: string, name: string, room: string = '') {
    try {
      // if doesnt work
      //   start with console.log inside all parts see what doesnt work
      //   cl error gave me the error that the hostname is undefinde
      const userExist = await this._isUserExist(name);
      if (!userExist) {
        const userCreateResponse = await axios.post('/users', {
          id,
          name,
          room,
        });
        return userCreateResponse;
      } else {
      }
    } catch (error) {}
  }

  async clearUser(id: string) {
    try {
      const clearUser = await axios.delete(`/users/${id}`);
      return clearUser;
    } catch (error) {}
  }

  async getUserDetail(id: string) {
    try {
      const userDetail = await axios.get(`/users/${id}`);
      return userDetail;
    } catch (error) {}
  }

  async getUsers() {
    try {
      const userList = await axios.get(`/users`);
      return userList;
    } catch (error) {}
  }

  async getUsersInRoom(roomId: string) {
    try {
      const userList = await axios.get(`/users?room=${roomId}`);
      return userList;
    } catch (error) {}
  }

  async assignRoom(room: string, uid: string, roomType: string) {
    try {
      const assingUser = await axios
        .patch(`/users/${uid}`, {
          room,
          uid,
          roomType,
        })
        .catch();
      console.log(uid);
      return assingUser;
    } catch (error) {}
  }

  async removeUserFromRoom(uid: string) {
    try {
      const removeRoom = await axios.patch(`/users/${uid}`, {
        room: '',
        roomType: '',
      });
      return removeRoom;
    } catch (error) {}
  }

  async _isUserExist(name: string) {
    const isExist = await this.getUsers().then((result) =>
      // Parameter 'user' implicitly has an 'any' type, but a better type may be inferred from usage.
      //  quick fix worked and gave me the result i wanted, also with any it worked
      // but any isnt recommended to use
      result?.data.find((user: { name: string }) => user.name === name)
    );

    let isUserExist = false;
    if (isExist) {
      isUserExist = true;
    }

    return isUserExist;
  }

  public createRandomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

export default APIService;
