(async () => {
  "use strict";
  //DOM section
  const tableBody = document.getElementById("table-body");
  const addBtn = document.querySelector(".add-user");
  const newUserForm = document.querySelector(".add-user-form");
  //Data section
  let users = await getUsers();
  console.log(users);
  //EVENT SECTION

  //AddUser
  newUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = getFromData(e.target);
    const user = await createUser(data);
    users.push(user);
    tableBody.innerHTML = getRenderedTableBody(users);
  });
  addBtn.addEventListener("click", () => {
    showModal("#add-modal");
  });
  //
  tableBody.addEventListener("click", async (e) => {
    let currentElement = e.target.parentNode;
    if (currentElement.classList.contains("user-name")) {
      const userId = +currentElement.getAttribute("data-uid");
      const user = users.find((user) => user.id === userId);
      showModal("#info-modal", getUserInModal(user));
    } else if (e.target.classList.contains("remove-btn")) {
      const userId = +e.target.getAttribute("data-uid");
      const userIndex = users.findIndex((user) => user.id === userId);
      let answer = confirm("Delete???");
      if (answer) {
        if (userIndex !== -1) {
          await removeUser(userId);
          users.splice(userIndex, 1);
          tableBody.innerHTML = getRenderedTableBody(users);
        }
      }
    }
  });
  //main
  async function getUsers() {
    return (await fetch("http://localhost:3000/users")).json();
  }
  //DELETE USERS FUNCTION
  async function removeUser(id) {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });
  }
  //Main
  tableBody.innerHTML = getRenderedTableBody(users);
  //RenderingUsers

  function getRenderedTableBody(users) {
    return users.reduce(
      (html, { id, name, username, email, website }) =>
        html +
        `
    <tr class="user-name" data-uid="${id}">
      <td>${name}</td>
      <td>${username}</td>
      <td>${email}</td>
      <td>${website}</td>
      <td><button data-uid="${id}" class ="remove-btn">Remove</button></td>
    </tr>
    `,
      ""
    );
  }
  //ModelWindowUsers
  function getUserInModal(user) {
    return `
    <div>city : ${user.address.city}</div>
    <div>street : ${user.address.street}</div>
    <div>zipcode : ${user.address.zipcode}</div>
    `;
  }
  //FormFunction
  async function createUser(user) {
    return (
      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
    ).json();
  }

  function getFromData(form) {
    const formData = Array.from(new FormData(form));
    const resObject = {};
    formData.forEach((item) => {
      if (item[0].indexOf(".") === -1) {
        resObject[item[0]] = item[1];
      } else {
        const props = item[0].split(".");
        resObject[props[0]] = {
          [props[1]]: item[1],
        };
      }
    });
    return resObject;
  }
  //ModalWindow
  function showModal(container, content = "") {
    const modal = document.querySelector(container);
    const modalBody = modal.querySelector(".modal-body");
    const close = document
      .querySelector(".close")
      .addEventListener("click", () => {
        modal.style.display = "none";
        overlay.remove();
      });
    const closeForm = document
      .querySelector(".save")
      .addEventListener("click", () => {
        if (newUserForm.checkValidity()) {
          modal.style.display = "none";
          overlay.remove();
        }
      });
    if (!!content) {
      modalBody.innerHTML = content;
    }
    modal.style.display = "block";
    const modalWidth = modal.offsetWidth / 2;
    const modalHeight = modal.offsetHeight / 2;
    modal.style.left = `calc(50% - ${modalWidth}px)`;
    modal.style.top = `calc(50vh - ${modalHeight}px)`;
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);
    overlay.addEventListener("click", () => {
      modal.style.display = "none";
      overlay.remove();
    });
  }

  //Sort Function
  function sortBy(users, propertyForSort, direction = "asc") {
    return users.sort((userA, userB) => {
      if (userA[propertyForSort] > userB[propertyForSort]) {
        return direction === "asc" ? 1 : -1;
      } else if (userA[propertyForSort] < userB[propertyForSort]) {
        return direction === "asc" ? -1 : 1;
      }
      return 0;
    });
  }
  let direction = "asc";
  //sortbyName
  document.querySelector(".sort-name").addEventListener("click", () => {
    users = sortBy(users, "name", direction);
    tableBody.innerHTML = getRenderedTableBody(users);
    direction = direction === "asc" ? "desc" : "asc";
  });
  //sortbyEmail
  document.querySelector(".sort-email").addEventListener("click", () => {
    users = sortBy(users, "email", direction);
    tableBody.innerHTML = getRenderedTableBody(users);
    direction = direction === "asc" ? "desc" : "asc";
  });
  //sortByNickname
  document.querySelector(".sort-username").addEventListener("click", () => {
    users = sortBy(users, "username", direction);
    tableBody.innerHTML = getRenderedTableBody(users);
    direction = direction === "asc" ? "desc" : "asc";
  });
  //sortByWebsite
  document.querySelector(".sort-website").addEventListener("click", () => {
    users = sortBy(users, "website", direction);
    tableBody.innerHTML = getRenderedTableBody(users);
    direction = direction === "asc" ? "desc" : "asc";
  });
})();
