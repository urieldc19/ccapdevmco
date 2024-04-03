document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    
    if (email.trim() === '' || username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    alert('Sign up successful! Welcome, ' + username + '!');
    window.location.href = "/";
  });
  