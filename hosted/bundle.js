"use strict";

var handleNFT = function handleNFT(e) {
  e.preventDefault();
  $("#NFTMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#NFTName").val() == '' || $("#NFTAge").val() == '' || $("#NFTness").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#NFTForm").attr("action"), $("#NFTForm").serialize(), function () {
    loadNFTsFromServer();
  });
  return false;
};

var handleDelete = function handleDelete(NFT) {
  var NFTId = NFT._id;

  var _csrf = document.querySelector("#tokenInput");

  var deleteData = "_csrf=".concat(_csrf.value, "&NFTId=").concat(NFTId);
  sendAjax('DELETE', '/delete-NFT', deleteData, loadNFTsFromServer);
};

var NFTForm = function NFTForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "NFTForm",
    onSubmit: handleNFT,
    name: "NFTForm",
    action: "/maker",
    method: "POST",
    className: "NFTForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "NFTName",
    type: "text",
    name: "name",
    placeholder: "NFT Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "NFTAge",
    type: "text",
    name: "age",
    placeholder: "NFT Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "NFTness"
  }, "NFTness: "), /*#__PURE__*/React.createElement("input", {
    id: "NFTness",
    type: "text",
    name: "NFTness",
    placeholder: "NFT ness"
  }), /*#__PURE__*/React.createElement("input", {
    id: "tokenInput",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeNFTSubmit",
    type: "submit",
    value: "Make NFT"
  }));
};

var NFTList = function NFTList(props) {
  if (props.NFTs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "NFTList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyNFT"
    }, "No NFTs yet"));
  }

  var NFTNodes = props.NFTs.map(function (NFT) {
    return /*#__PURE__*/React.createElement("div", {
      key: NFT._id,
      className: "NFT"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/toad.png",
      alt: "NFT image",
      className: "NFTFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "NFTName"
    }, " Name: ", NFT.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "NFTAge"
    }, " Age: ", NFT.age, " "), /*#__PURE__*/React.createElement("h3", {
      className: "NFTness"
    }, " NFTness: ", NFT.ness, " "), /*#__PURE__*/React.createElement("input", {
      className: "NFTRelease",
      type: "submit",
      value: "Release",
      onClick: function onClick() {
        return handleDelete(NFT);
      }
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "NFTList"
  }, NFTNodes);
};

var loadNFTsFromServer = function loadNFTsFromServer() {
  sendAjax('GET', '/getNFTs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
      NFTs: data.NFTs
    }), document.querySelector("#NFTs"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTForm, {
    csrf: csrf
  }), document.querySelector("#makeNFT"));
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
    NFTs: []
  }), document.querySelector("#NFTs"));
  loadNFTsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#NFTMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("NFTMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
