// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { orderBy, query, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyD9wb7FVWS4lk-xe6jVjbLeIWZRNGoZY",
  authDomain: "p1teamhomepage.firebaseapp.com",
  projectId: "p1teamhomepage",
  storageBucket: "p1teamhomepage.appspot.com",
  messagingSenderId: "1064610336155",
  appId: "1:1064610336155:web:ef624e019c8ce49bae653e",
  measurementId: "G-5V9LYC2QW3"
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

$(document).ready(function () {
  /*추가버튼 팝업 열기*/
  $(".pop_btn, #write_btn, #search_btn").click(function (event) {
    event.preventDefault();
    var targetID = $(this).attr("href");
    $(targetID).fadeIn();
  });

  /*팝업 취소 버튼 팝업 닫기*/
  $("#cancel_wr, #cancel_search").click(function () {
    var popupID = $(this).data("target");
    $(popupID).fadeOut();
  });

  /*수정팝업2에서 취소 누르면 전에 떠있던 수정팝업1까지 다 닫기 */
  $("#cancel_update").click(function () {
    $(".popup").fadeOut(0);
  });

  /*수정팝업1의 검색할때 있으면 불러오고 수정팝업2 띄우고 없으면 알람*/
  $("#update_btn").click(async function () {
    var searchMemberId = $("#searchmember").val(); //searchmember 변수에 검색 input에 넣은 문자열을 저장.
    console.log(searchMemberId); //함 체크

    const docRout = doc(db, "members", searchMemberId); // 변수 searchMemberId의 문자열과 같은 이름을 갖고있는 문서까지 참조
    const docFields = await getDoc(docRout); // 변수 docFields에 docRoute 참조를 따라갔을 때 나오는 Document의 정보를 넣음

    /*문서가 존재하냐*/
    if (docFields.exists()) {
      const memberData = docFields.data(); /*변수 memberData에 Document의 정보들을 넣어줌*/
      /* 변수 memberDate에 docFields다 들어왔는지 체크 한번*/
      console.log(memberData);

      /* 각 필드 값을 변수로 저장*/
      const image = memberData.image;
      const surname = memberData.surname;
      const firstname = memberData.firstname;
      const mbti = memberData.mbti;
      const email = memberData.email;
      const blog = memberData.blog;
      const comment = memberData.comment;

      /*update_popup에 정보 넣기 (성, 이름은 수정불가)*/
      document.getElementById("serverimage").value = image;
      document.getElementById("serversurname").value = surname;
      document.getElementById("serverfirstname").value = firstname;
      document.getElementById("servermbti").value = mbti;
      document.getElementById("serveremail").value = email;
      document.getElementById("serverblog").value = blog;
      document.getElementById("servercomment").value = comment;

      $("#update_popup").fadeIn(); /*보이게*/
    } else {
      /*존재안할때 console에 남김*/
      console.log("No such member found");
      alert("해당 팀원을 찾을 수 없습니다. 이름을 확인해주세요. \n(띄어쓰기 주의!)");
    }
  });

  /*수정팝업2에 수정하기 버튼 누르면 update됨 */
  $("#complete_update_btn").click(async function () {
    let image = $("#serverimage").val();
    let surname = $("#serversurname").val();
    let firstname = $("#serverfirstname").val();
    let mbti = $("#servermbti").val();
    let comment = $("#servercomment").val();
    let email = $("#serveremail").val();
    let blog = $("#serverblog").val();
    let timestamp = new Date(); // 변수 timestamp에 지금 시간을 저장

    const docId = surname + firstname; /*document이름을 성+이름*/

    if (image.length === 0) {
      alert("이미지URL을 입력해주세요.");
    } else if (mbti.length === 0) {
      alert("MBTI를 선택해주세요.");
    } else if (comment.length === 0) {
      alert("각오를 입력해주세요.");
    } else if (email.length === 0) {
      alert("이메일을 입력해주세요.");
    } else if (blog.length === 0) {
      alert("블로그주소를 입력해주세요.");
    } else {
      const docRef = doc(db, "members", docId); /*document 중복된 이름 없으면 생성*/
      let docData = {
        image: image,
        surname: surname,
        firstname: firstname,
        mbti: mbti,
        comment: comment,
        blog: blog,
        email: email,
        timestamp: timestamp
      };
      console.log(docData);
      await updateDoc(docRef, docData); /*콜렉션 members에 update*/
      alert("수정한 내용이 저장되었습니다.");
      window.location.reload(); /*새로고침*/
    }
  });
});

// 추가하기 버튼 누르면 Firebase에 저장
$("#postingbtn").click(async function () {
  let image = $("#image").val();
  let surname = $("#surname").val();
  let firstname = $("#firstname").val();
  let mbti = $("#mbti").val();
  let comment = $("#comment").val();
  let email = $("#email").val();
  let blog = $("#blog").val();

  let timestamp = new Date(); /*마지막으로 저장한 시간*/
  const docId = surname + firstname; /*document이름을 성+이름*/

  if (/[\s]/.test(surname) || /[\s]/.test(firstname)) {
    alert("이름에 공백이 있습니다.");
    return;
  }

  if (image.length === 0) {
    alert("이미지URL을 입력해주세요.");
  } else if (surname.length === 0) {
    alert("성을 입력해주세요.");
  } else if (firstname.length === 0) {
    alert("이름을 입력해주세요.");
  } else if (mbti.length === 0) {
    alert("MBTI를 선택해주세요.");
  } else if (comment.length === 0) {
    alert("각오를 입력해주세요.");
  } else if (email.length === 0) {
    alert("이메일을 입력해주세요.");
  } else if (blog.length === 0) {
    alert("블로그주소를 입력해주세요.");
  } else {
    const docRef = doc(db, "members", docId); /*document 중복된 이름 없으면 생성*/
    let docData = {
      image: image,
      surname: surname,
      firstname: firstname,
      mbti: mbti,
      comment: comment,
      blog: blog,
      email: email,
      timestamp: timestamp
    };
    console.log(docData);
    await setDoc(docRef, docData); /*member에 저장*/
    alert("저장되었습니다.");
    window.location.reload(); /*새로고침*/
  }
});

// Firebase에 저장된 값들 카드로 띄우기
//let docs = await getDocs(query(collection(db, "members"),orderBy("timestamp")));
let docs = await getDocs(query(collection(db, "members"), orderBy("timestamp", "desc")));
/*docs라는 변수에 members의 Document를 가져오는데, "timestamp"필드를 기준으로 최신것부터 정렬(orderBy)해서 query로 저장*/
docs.forEach((doc) => {
  let row = doc.data();

  let image = row["image"];
  let surname = row["surname"];
  let firstname = row["firstname"];
  let mbti = row["mbti"];
  let email = row["email"];

  let new_card = `
            <div class="col">
                <div class="card h-100">
                    <a href=introMyself.html?id=${surname}${firstname}>
                        <div class="cardimg-wrap">
                            <img src="${image}" alt="..." class="card-img">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">이름 : ${surname}${firstname}</h5>
                            <p class="card-text">MBTI : ${mbti}</p>
                            <p class="card-text">이메일 : ${email}</p>
                        </div>
                    </a>
                </div>
            </div>`;
  $("#card").append(new_card);
});

// 4파르타 버튼
$("#maintitle").click(async function () {
  $("#teamintrobox123").toggle();
});
