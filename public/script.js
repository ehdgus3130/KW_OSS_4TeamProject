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
    toggleIcon.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // 위로 스크롤 기능
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
