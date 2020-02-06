document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4461 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetch("https://randopic.herokuapp.com/images/4461")
    .then(res => res.json())
    .then(img => renderImage(img))

  likeButton().addEventListener("click", addLike)
  commentForm().addEventListener("submit", submitComment)
})

function likeButton() {
    return document.getElementById("like_button")
}

function commentForm() {
    return document.getElementById("comment_form")
}

function likeCount() {  
    return document.getElementById("likes")
}

function submitComment(e) {
    e.preventDefault()
    let payload = {
          image_id: imgId(),
          content: commentForm().comment.value
        }
    fetch("https://randopic.herokuapp.com/comments", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(comment => addComment(comment))
    commentForm().reset()
}

function imgId() {
    return document.getElementById("image").dataset.id

}

function addLike() {
    let newLikes = parseInt(likeCount().innerText) + 1
    likeCount().innerText = newLikes

    let body = {
      image_id: imgId()
    }
    fetch("https://randopic.herokuapp.com/likes", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}

function renderImage(img){
    let title = document.getElementById("name")
    title.innerText = img.name 

    let imgNode = document.getElementById("image")
    imgNode.dataset.id = img.id
    imgNode.src = img.url 

    likeCount().innerText = img.like_count

    img.comments.forEach(comment => addComment(comment))


}

function addComment(comment) {
    let commentList = document.getElementById("comments")
    let commentItem = document.createElement("li")
    commentList.appendChild(commentItem)
    commentItem.innerText = comment.content 
    commentItem.dataset.id = comment.id
    let deleteButton = document.createElement('button')
    deleteButton.innerText = "X"
    deleteButton.addEventListener('click', deleteComment)
    commentItem.appendChild(deleteButton)
}

function deleteComment(e) {
    let commentID = e.target.parentElement.dataset.id
    fetch(`https://randopic.herokuapp.com/comments/${commentID}`, {
        method: "DELETE"
    }).then(r => r.json()).then(() => e.target.parentElement.remove())

    
}

