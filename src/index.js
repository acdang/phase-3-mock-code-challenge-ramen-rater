// request the data from the server to get all the ramen objects 
function fetchRamen() {
    return fetch('http://localhost:3000/ramens')
    .then(resp => resp.json())
}

// given an id, return Ramen object with that id
function findRamen(id) {
    return fetchRamen().then(ramensArray => ramensArray.find(ramen => ramen.id == id))
}

// display the image for each of the ramen inside the #ramen-menu div
function renderMenu() {
    const menuDiv = document.querySelector('div#ramen-menu')

    fetchRamen().then(ramensArray => ramensArray.map(ramen => {
        // create img tag
        const ramenImg = document.createElement('img')
        // assign img attributes
        ramenImg.src = ramen.image
        ramenImg.alt = ramen.name
        ramenImg.dataset.id = ramen.id
        // append img to div
        menuDiv.appendChild(ramenImg)
    }))
}

// display ramen info in #ramen-detail div when user clicks an img from #ramen-menu div
function renderRamenDetails() {
    const ramenDetail = document.querySelector('div#ramen-detail')

    const detailImg = ramenDetail.querySelector('img.detail-image')
    const detailName = ramenDetail.querySelector('h2.name')
    const detailRestuarant = ramenDetail.querySelector('h3.restaurant')

    const menuDiv = document.querySelector('div#ramen-menu')

    menuDiv.addEventListener('click', function(event) {
        if (event.target.matches('img')) {
            findRamen(event.target.dataset.id).then(ramen => {
                ramenDetail.dataset.id = ramen.id

                detailImg.src = ramen.image
                detailImg.alt = ramen.name
                detailName.textContent = ramen.name
                detailRestuarant.textContent = ramen.restaurant

                renderFormDetails(ramen.id)
            })
            
        }
    })
}

// given ramen id, display current rating and comment for that ramen
function renderFormDetails(id) {
    const form = document.querySelector('form#ramen-rating')

    const ratingInput = form.querySelector('input#rating')
    const commentInput = form.querySelector('textarea#comment')

    findRamen(id).then(ramen => {
        form.dataset.id = id

        ratingInput.value = ramen.rating
        commentInput.value = ramen.comment
        handleFormUpdate()
    })
}

// Update the rating and comment for a ramen
function handleFormUpdate() {
    const form = document.querySelector('form#ramen-rating')

    findRamen(form.dataset.id).then(ramen => {
        form.addEventListener('submit', function(event) {
            event.preventDefault()
    
            // get user input
            const newRatingInput = event.target.rating.value
            const newCommentInput = event.target.comment.value
    
            let newInfo
            // check if input values updated
            if (ramen.rating !== newRatingInput && ramen.comment !== newCommentInput) {
                newInfo = {
                    rating: newRatingInput,
                    comment: newCommentInput
                }
            } else if (ramen.rating !== newRatingInput) {
                newInfo = {
                    rating: newRatingInput
                }
            } else if (ramen.rating !== newCommentInput) {
                newInfo = {
                    rating: newRatingInput
                }
            }
    
            if (ramen.rating !== newRatingInput || ramen.comment !== newCommentInput) {
                const configObject = {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json'
                    },
                    body: JSON.stringify(newInfo)
                  }
    
                fetch(`http://localhost:3000/ramens/${form.dataset.id}`, configObject)
            } else {
                console.log("No updated fields!")
            }
        })
    })
}

renderMenu()
renderRamenDetails()
