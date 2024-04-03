
    function isLoggedIn (username) {
  
    if (username !== "")
    {
      trueLogIn(username);
      if (document.getElementById('createpostbtn') !== null)
        createPostButton();
    }
    else {
      falseLogIn();
    }
  }
  
  function trueLogIn (username) {
  
    document.getElementById("mainheader").innerHTML += `
    <button class="btn" id="viewbtn" onclick="view()"></button>
    <span id='headerusername'>${username}</span>
    <div class="settings">
      <button class="btn" id="menubtn">ooo</button>
      <div class="menucontent">
          <a href="/profile">View Profile</a>
          <a href="/editprofile">Edit Profile</a>
          <a href="/signout">Sign Out</a>
      </div>
    </div>`;
  }
  
  function createPostButton () {
    document.getElementById('createpostbtn').innerHTML = `<div class="btn" id="createpost">
    <a href="/post/create">Create Post</a>
    </div>`;
  }
  
  function falseLogIn () {
    document.getElementById("mainheader").innerHTML += `
          <button class="btn" id="loginbtn" onclick="login()">Log In</button>
          <div class="settings">
              <button class="btn" id="menubtn">ooo</button>
              <div class="menucontent">
              <a href="/register">Sign Up</a>
              </div>
          </div>`;
  }
  
  function promptContent() {
    // Show content field and the second "Create Post" button
    document.getElementById('postContent').style.display = 'block';
    document.getElementById('createPostBtn').style.display = 'inline-block';
  }
