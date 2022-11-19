const loginText = document.querySelector(".title-text .login");
const login = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = () => {
  login.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};
loginBtn.onclick = () => {
  login.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};

// Above code is completely for stylings

$(document).ready(function () {
  function handleError(message) {
    $("#message").addClass("errorForMessage", 500, callBack);
    $("#message").text(message);
    $("#message").animate(
      {
        height: "60px",
        padding: "10px",
      },
      500
    );
    function callBack() {
      setTimeout(function () {
        $("#message").animate(
          {
            height: "0",
            padding: "0",
          },
          500
        );
        setTimeout(function () {
          $("#message").removeClass("errorForMessage");
        }, 1500);
      }, 1500);
    }
  }

  function handleSuccess(message) {
    return new Promise(function (resolve, reject) {
      $("#message").addClass("successForMessage", 500, callBack);
      $("#message").text(message);
      $("#message").animate(
        {
          height: "60px",
          padding: "10px",
        },
        500
      );
      function callBack() {
        setTimeout(function () {
          $("#message").animate(
            {
              height: "0",
              padding: "0",
            },
            500
          );
          setTimeout(function () {
            $("#message").removeClass("successForMessage");
            resolve();
          }, 1500);
        }, 1500);

      }
    });
  }

  function postForm(path, params, method) {
    method = method || "post";

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  }

  $("#loginForm").submit(function (e) {
    e.preventDefault();
    email = $("#log_in_email").val();
    password = $("#log_in_password").val();
    var data = { email: email, password: password };
    $.ajax({
      method: "POST",
      url: "/loginvalidate",
      contentType: "application/json;charset=utf-8",
      cache: false,
      datatype: "text",
      data: JSON.stringify(data),
      success: function (data) {
        if (data == "success") {
          handleSuccess("Login Success").then(function(){
            postForm("/login",{username:username})
          });
        } else {
          handleError("Invalid credentials");
        }
      },
      error: function (data) {
        alert("error" + data);
      },
    });
    return false;
  });
  //  Above code is for login
  function checkForExistingUser(data) {
    return new Promise(function (resolve, reject) {
      var emailJson = { email: data };
      $.ajax({
        method: "POST",
        url: "/checkForExistingUser",
        contentType: "application/json",
        cache: false,
        datatype: "text",
        async: false,
        data: JSON.stringify(emailJson),
        success: function (data_from_server) {
          if (data_from_server !== "true") {
            console.log("yes");
            resolve(data_from_server);
          } else {
            handleError("Email Id is already in use");
            reject(data_from_server);
          }
        },
        error: function (data_from_server) {
          reject(data_from_server);
        },
      });
    });
  }

  $.validator.addMethod(
    "validatePassword",
    function (value, element) {
      return (
        this.optional(element) ||
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          value
        )
      );
    },
    "Password must contain 1 uppercase,1 lowercase,1 number,1 special character"
  );

  $.validator.addMethod(
    "validatePhone",
    function (value, element) {
      return this.optional(element) || /^[6-9]\d{9}$/.test(value);
    },
    "Enter valid Phone Number"
  );

  $("#registerForm").validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      username: {
        required: true,
      },
      password: {
        required: true,
        validatePassword: true,
      },
      confirmPassword: {
        required: true,
        equalTo: "#password",
      },
      phoneNumber: {
        required: true,
        validatePhone: true,
      },
    },
    messages: {
      email: {
        required: "Email is required",
        email: "Enter valid email",
      },
      username: {
        required: "Username is required",
      },
      password: {
        required: "Password is required",
        minlength: "Password must contains minimum 8 characters",
      },
      confirmPassword: {
        equalTo: "Password must be equal to confirm Password",
        required: "Confirm Password is required",
      },
      phoneNumber: {
        required: "Phone Number is required",
      },
    },
    submitHandler: function (form) {
      email = $("#email").val();
      checkForExistingUser(email)
        .then(function () {
          console.log("mail is available");
          mail = $("#email").val();
          username = $("#username").val();
          password = $("#password").val();
          phone = $("#phoneNumber").val();
          jsonObject = {
            mail: mail,
            username: username,
            password: password,
            phone: phone,
          };
          $.ajax({
            method: "POST",
            url: "/register",
            contentType: "application/json",
            cache: false,
            datatype: "text",
            async: false,
            data: JSON.stringify(jsonObject),
            success: function (data_from_server) {
              if (data_from_server == "success") {
                // console.log("yes submitted");
                handleSuccess("Sign up Success!").then(function(){
                  window.location.href = "/";
                })
              } else {
                handleError("Sign up Failed");
                // console.log("not submitted");
              }
            },
            error: function (data_from_server) {
              console.log("not submitted");
            },
          });
        })
        .catch(function () {
          console.log("mail is already used");
        });
      return false;
    },
  });
});