import { observable, action } from 'mobx';
import { fetchData, sendData } from '../utils/restCalls';

const serverUrl = process.env.SERVER_URL;


export class UsersStore {
    @observable users = [];

    @observable error = undefined;

    @observable newUserName = undefined;

    @observable isUsersLoading = false;

    parseState(data) {
      const userData = [];
      const res = JSON.parse(data);
      Object.keys(res.data).forEach((username) => {
        const datum = res.data[username];
        const macs = datum.mac;
        const { label } = datum;
        userData.push({ username, macs, label });
      });
      this.users = userData;
    }


    @action load() {
      this.isUsersLoading = true;
      fetchData(`${serverUrl}ui/getUsers`).then(action(({ data }) => {
        this.parseState(data);
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isUsersLoading = false;
      }));
    }

    @action unAssignMac(user, mac) {
      this.isUsersLoading = true;
      sendData(`${serverUrl}ui/removeMacToUser`,
        'POST',
        JSON.stringify({ username: user, mac }), {
          'Content-Type': 'application/json',
        }).then(action(() => {
        action(this.load());
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isUsersLoading = false;
      }));
    }

    @action assignMac(user, mac) {
      this.isUsersLoading = true;
      sendData(`${serverUrl}ui/assignMac`,
        'POST',
        JSON.stringify({ username: user, mac }), {
          'Content-Type': 'application/json',
        }).then(action(() => {
        action(this.load());
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isUsersLoading = false;
      }));
    }

    @action setFormData(elementName, elementValue) {
      this[elementName] = elementValue;
    }

    @action deleteUser(user) {
      this.isUsersLoading = true;
      sendData(`${serverUrl}ui/removeUser`,
        'POST',
        JSON.stringify({ username: user }), {
          'Content-Type': 'application/json',
        }).then(action(() => {
        action(this.load());
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isUsersLoading = false;
      }));
    }

    @action addUser() {
      this.isUsersLoading = true;
      sendData(`${serverUrl}ui/addUser`,
        'POST',
        JSON.stringify({ username: this.newUserName }), {
          'Content-Type': 'application/json',
        }).then(action(() => {
        action(this.load());
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isUsersLoading = false;
      }));
    }
}

export default new UsersStore();
