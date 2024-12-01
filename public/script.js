document.addEventListener('DOMContentLoaded', () => {
    // 게임 데이터 가져오기
    async function fetchGames() {
        try {
            const response = await fetch('/api/games');
            const games = await response.json();
            allGames = games; // 모든 게임 데이터를 저장
            totalPages = Math.ceil(allGames.length / gamesPerPage);
            currentPage = 1;
            displayGames();
            setupPagination();
        } catch (error) {
            console.error('게임 데이터를 가져오는 중 오류 발생:', error);
        }
    }
    window.addEventListener('scroll', function () {
        var container = document.querySelector('.toggle-and-add-container');
        var scrollTop = window.scrollY || document.documentElement.scrollTop;

        // 스크롤 양에 맞춰 top 값을 변경 (필요에 따라 값 조정)
        container.style.top = (scrollTop * 1.3 + 20) + 'px';
    });
    document.getElementById('toggle-icon').addEventListener('mouseenter', function () {
        var darkModeText = document.getElementById('darkModeText');

        // 다크모드 상태에 따라 텍스트 업데이트
        if (document.body.classList.contains('dark-mode')) {
            darkModeText.textContent = 'WhiteMode';  // 다크모드일 때 "WhiteMode"
        } else {
            darkModeText.textContent = 'DarkMode';  // 다크모드가 아닐 때 "DarkMode"
        }

        // 마우스가 올라갔을 때 텍스트 표시
        darkModeText.style.display = 'inline-block';
    });

    document.getElementById('toggle-icon').addEventListener('mouseleave', function () {
        var darkModeText = document.getElementById('darkModeText');

        // 마우스가 벗어났을 때 텍스트 숨기기
        darkModeText.style.display = 'none';
    });

    document.getElementById('toggle-icon').addEventListener('click', function () {
        document.body.classList.toggle('dark-mode'); // 다크모드 토글

        // 모드가 변경될 때마다 텍스트 업데이트
        var darkModeText = document.getElementById('darkModeText');
        if (document.body.classList.contains('dark-mode')) {
            darkModeText.textContent = 'LightMode';  // 다크모드일 때 "WhiteMode"
        } else {
            darkModeText.textContent = 'DarkMode';  // 다크모드가 아닐 때 "DarkMode"
        }
    });

    document.getElementById('add-game-btn').addEventListener('mouseenter', function () {
        var addGameText = document.getElementById('add-game-text');
        addGameText.style.display = 'inline-block';  // 마우스가 올라갔을 때 텍스트 표시
        addGameText.style.opacity = 1;  // 텍스트가 부드럽게 나타나도록 opacity 조정
    });

    document.getElementById('add-game-btn').addEventListener('mouseleave', function () {
        var addGameText = document.getElementById('add-game-text');
        addGameText.style.opacity = 0;  // 텍스트가 부드럽게 사라지도록 opacity 조정
        setTimeout(function () {
            addGameText.style.display = 'none';  // 마우스가 벗어났을 때 텍스트 숨기기
        }, 300); // 텍스트가 사라지는 애니메이션 끝난 후 숨김
    });




    // 댓글 데이터 가져오기
    async function fetchComments() {
        try {
            const response = await fetch('/api/comments');
            const comments = await response.json();
            displayComments(comments);
        } catch (error) {
            console.error('댓글 데이터를 가져오는 중 오류 발생:', error);
        }
    }

    // 댓글 목록 표시 함수
    function displayComments(comments) {
        const commentsList = document.getElementById("comments-list");
        commentsList.innerHTML = ''; // 기존 댓글 초기화
        comments.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.setAttribute("data-id", comment._id); // 댓글 ID 저장
            commentDiv.innerHTML = `
                <p><strong>${comment.nickname}:</strong> ${comment.content}</p>
                <button class="delete-btn">삭제</button>
            `;
            // 삭제 버튼 클릭 이벤트 리스너 추가
            commentDiv.querySelector(".delete-btn").addEventListener("click", () => deleteComment(comment._id, comment.nickname));
            commentsList.appendChild(commentDiv);
        });
    }

    // 댓글 추가 함수
    async function addComment() {
        const nickname = document.getElementById("nickname-input").value.trim();
        const commentInput = document.getElementById("comment-input").value.trim();
        const password = document.getElementById("password-input").value.trim();

        if (nickname && commentInput && password) {
            try {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nickname, content: commentInput, password }),
                });

                if (response.ok) {
                    const comment = await response.json();
                    fetchComments(); // 새 댓글을 포함한 전체 댓글 목록을 갱신
                    document.getElementById("nickname-input").value = "";
                    document.getElementById("comment-input").value = "";
                    document.getElementById("password-input").value = "";
                } else {
                    console.error('댓글 추가 실패');
                }
            } catch (error) {
                console.error('댓글 추가 중 오류 발생:', error);
            }
        } else {
            alert('닉네임, 댓글, 암호를 모두 입력해주세요!');
        }
    }

    // 댓글 삭제 함수
    async function deleteComment(commentId, nickname) {
        const password = prompt(`${nickname}님의 댓글을 삭제하려면 암호를 입력해주세요:`);

        if (password) {
            try {
                const response = await fetch(`/api/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                });

                if (response.ok) {
                    fetchComments(); // 댓글 삭제 후 전체 댓글 목록을 갱신
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || '댓글 삭제 실패');
                }
            } catch (error) {
                console.error('댓글 삭제 중 오류 발생:', error);
            }
        }
    }

    // 댓글 전송 이벤트 리스너
    document.getElementById("submit-btn").addEventListener("click", addComment);
    document.getElementById("comment-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addComment();
        }
    });

    // 페이지네이션 설정
    function setupPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = ''; // 기존 페이지네이션 초기화

        // Previous 버튼
        const prevLi = document.createElement('li');
        const prevLink = document.createElement('a');
        prevLink.textContent = 'Previous';
        prevLink.href = '#';
        if (currentPage === 1) {
            prevLink.classList.add('disabled');
        }
        prevLi.appendChild(prevLink);
        pagination.appendChild(prevLi);



        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                displayGames();
                setupPagination();
                scrollToTop();
            }
        });

        // 페이지 번호
        const maxPageButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = i;
            link.href = '#';
            if (i === currentPage) {
                link.classList.add('active');
            }
            li.appendChild(link);
            pagination.appendChild(li);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                displayGames();
                setupPagination();
                scrollToTop();
            });
        }

        // '...' 표시
        if (endPage < totalPages) {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.padding = '8px 12px';
            span.style.color = '#333';
            li.appendChild(span);
            pagination.appendChild(li);
        }

        // Next 버튼
        const nextLi = document.createElement('li');
        const nextLink = document.createElement('a');
        nextLink.textContent = 'Next';
        nextLink.href = '#';
        if (currentPage === totalPages) {
            nextLink.classList.add('disabled');
        }
        nextLi.appendChild(nextLink);
        pagination.appendChild(nextLi);

        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                displayGames();
                setupPagination();
            }
        });
    }

    // 초기 데이터 로드
    let allGames = [];
    let currentPage = 1;
    const gamesPerPage = 8;
    let totalPages = 1;

    fetchGames();
    fetchComments();

    // 검색 기능
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");

    async function searchGame() {
        const query = searchInput.value.trim().toLowerCase();

        try {
            if (query === "") {
                // 검색어가 없으면 전체 게임 표시
                allGames = [];
                const response = await fetch('/api/games');
                const games = await response.json();
                allGames = games;
            } else {
                const response = await fetch(`/api/games/search?q=${encodeURIComponent(query)}`);
                const games = await response.json();
                allGames = games;
            }
            totalPages = Math.ceil(allGames.length / gamesPerPage);
            currentPage = 1;
            displayGames();
            setupPagination();
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
        }
    }

    searchButton.addEventListener("click", searchGame);
    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            searchGame();
        }
    });

    // 다크모드 전환 함수
    const toggleIcon = document.getElementById("toggle-icon");
    let isDarkMode = false;

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle("dark-mode", isDarkMode);
        toggleIcon.src = isDarkMode ? "./image/moon.png" : "./image/sun.png";

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.color = isDarkMode ? '#fff' : '#333';
        });
    }

    if (toggleIcon) {
        toggleIcon.addEventListener("click", toggleDarkMode);
    } else {
        console.error('toggle-icon element not found');
    }

    // 댓글 전송 이벤트 리스너
    document.getElementById("submit-btn").addEventListener("click", addComment);
    document.getElementById("comment-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addComment();
        }
    });
    /* 모달 창 */
    // "게임 추가" 이미지 버튼 클릭 시 모달 창 열기
    document.getElementById("add-game-btn").addEventListener("click", function () {
        openModal(); // 모달 창 열기
    });

    // 모달 창 열기 함수
    function openModal() {
        document.getElementById("game-add-modal").style.display = "block"; // 모달 보이기
    }

    // 모달 창 닫기 기능
    document.getElementById("close-modal").addEventListener("click", function () {
        document.getElementById("game-add-modal").style.display = "none"; // 모달 숨기기
    });

    document.getElementById("add-game").addEventListener("click", function () {
        console.log('게임 추가 버튼이 클릭되었습니다.');  // 로그로 확인
        addGame(); // 게임 추가 함수 호출
    });



    function addGame() {
        // 입력 필드에서 값 가져오기
        const title = document.getElementById("new-game-title").value.trim();
        const genre = document.getElementById("new-game-genre").value.trim();
        const gamelink = document.getElementById("new-game-link").value.trim();
        const image = document.getElementById("new-game-image").value.trim();
        // 게임 정보 출력 (예시로 콘솔에 출력)
        console.log("게임 제목:", title);
        console.log("게임 장르:", genre);
        console.log("게임 평점:", gamelink);
        console.log("게임 이미지 링크:", image);
        // 입력값 검증
        if (!title || !genre || !gamelink || !image) {
            alert("모든 항목을 올바르게 입력해주세요!");
            return;
        }

        // 모달 창 닫기
        document.getElementById("game-add-modal").style.display = "none";

        // 입력 필드 초기화
        document.getElementById("new-game-title").value = "";
        document.getElementById("new-game-genre").value = "";
        document.getElementById("new-game-link").value = "";
        document.getElementById("new-game-image").value = "";

        alert("게임이 추가되었습니다!");
    }



    /*------------*/
});
