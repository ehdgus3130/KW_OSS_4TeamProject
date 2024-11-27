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

    // 게임 카드 생성 함수
    function createGameCard(game) {
        return `
            <div class="col">
                <div class="card h-100">
                    <img src="${game.image}" class="card-img-top" alt="${game.title}">
                    <div class="card-body">
                        <h5 class="card-title">${game.title}</h5>
                        <p class="card-text">${game.genre}</p>
                        <div class="game-rating">${'★'.repeat(game.rating)}${'☆'.repeat(5 - game.rating)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // 게임 목록 표시 함수
    function displayGames() {
        const container = document.getElementById('more-games-container');
        const startIndex = (currentPage - 1) * gamesPerPage;
        const endIndex = startIndex + gamesPerPage;
        const gamesToShow = allGames.slice(startIndex, endIndex);
        container.innerHTML = gamesToShow.map(createGameCard).join('');
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
                <p>${comment.content}</p>
                <button class="delete-btn">삭제</button>
            `;
            // 삭제 버튼 클릭 이벤트 리스너 추가
            commentDiv.querySelector(".delete-btn").addEventListener("click", () => deleteComment(comment._id));
            commentsList.appendChild(commentDiv);
        });
    }

    // 댓글 삭제 함수
    async function deleteComment(commentId) {
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // 댓글 제거
                const commentDiv = document.querySelector(`.comment[data-id='${commentId}']`);
                if (commentDiv) {
                    commentDiv.remove(); // DOM에서 댓글 삭제
                }
            } else {
                console.error('댓글 삭제 실패:', await response.json());
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
        }
    }

    // 댓글을 추가하는 함수 (서버에 POST 요청)
    async function addComment() {
        const commentInput = document.getElementById("comment-input");
        const newComment = commentInput.value.trim();

        if (newComment) {
            try {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: newComment }),
                });

                if (response.ok) {
                    const comment = await response.json();
                    // 댓글 목록에 새 댓글 추가
                    const commentsList = document.getElementById("comments-list");
                    const li = document.createElement("div");
                    li.classList.add("comment");
                    li.setAttribute("data-id", comment._id); // 댓글 ID 저장
                    li.innerHTML = `
                        <p>${comment.content}</p>
                        <button class="delete-btn">삭제</button>
                    `;
                    // 삭제 버튼 클릭 이벤트 리스너 추가
                    li.querySelector(".delete-btn").addEventListener("click", () => deleteComment(comment._id));
                    commentsList.prepend(li); // 최신 댓글을 위에 추가
                    commentInput.value = "";
                } else {
                    console.error('댓글 추가 실패');
                }
            } catch (error) {
                console.error('댓글 추가 중 오류 발생:', error);
            }
        }
    }

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

    // "게임 추가" 버튼 클릭 이벤트 핸들러
    document.getElementById("add-game-btn").addEventListener("click", function () {
        // 입력 필드에서 값 가져오기
        const title = document.getElementById("new-game-title").value.trim();
        const genre = document.getElementById("new-game-genre").value.trim();
        const rating = document.getElementById("new-game-rating").value.trim();
        const image = document.getElementById("new-game-image").value.trim();

        // 입력값 검증
        if (!title || !genre || !rating || !image) {
            alert("모든 항목을 채워주세요!");
            return;
        }

        // 게임 컨테이너 선택
        const container = document.getElementById("more-games-container");

        // 새 게임 카드 생성
        const gameCard = document.createElement("div");
        gameCard.className = "col";
        gameCard.innerHTML = `
        <div class="card">
            <img src="${image}" class="card-img-top" alt="${title}">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${genre}</p>
                <div class="game-rating">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</div>
            </div>
        </div>
    `;

        // 새 게임 카드를 컨테이너에 추가
        container.appendChild(gameCard);

        // 입력 필드 초기화
        document.getElementById("new-game-title").value = "";
        document.getElementById("new-game-genre").value = "";
        document.getElementById("new-game-rating").value = "";
        document.getElementById("new-game-image").value = "";

        alert("당신의 게임이 추가되었습니다!");
    });

});
