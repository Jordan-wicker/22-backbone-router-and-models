var appContainer = document.querySelector('#app-container')
var contentArea = document.querySelector('.content-area')

var BookModel = Backbone.Model.extend({
   url: "",
   parse: function(parsedData){
     return parsedData.volumeInfo
   },
})

var BookCollections = Backbone.Collection.extend({
  model: BookModel,
  url:"",

  parse: function(parsedDataCol){
    return parsedDataCol.items
  },

  initialize: function(cVal){
     this.url = "https://www.googleapis.com/books/v1/volumes?q=subject:" + cVal
  },
})



var AppRouter = Backbone.Router.extend({

   routes: {
      "books/:categories/:subcategory" : "showSubCategory",
      "books/:categories" : "showGeneralCategory",
      "*path" : "showHomePage"

   },

   showSubCategory: function(placeholder, categories){
     var bookcollectionsInstance = new BookCollections(categories)
      bookcollectionsInstance.fetch().then(function(serverRes){

        var subPictureStr = ''
          subPictureStr += '<h1 class="book-class">' + categories.toUpperCase() + '</h1>'
        bookcollectionsInstance.models.forEach(function(modelData){
          subPictureStr += '<div class="col-xs-4 col-sm-3 column-container">'
          var bookLink = modelData.get('imageLinks')
            var bookImage = modelData.attributes.imageLinks.thumbnail

          subPictureStr += '<img class="book-image" src="' + bookImage + '"/>'
          subPictureStr += '<p class="book-title">' + modelData.attributes.title + '</p>'
          subPictureStr += '</div>'

        })
            contentArea.innerHTML = subPictureStr
      })
    },

   showGeneralCategory: function(categories){
     var bookcollectionsInstance = new BookCollections(categories)
      bookcollectionsInstance.fetch().then(function(serverRes){
        var bigPictureStr = ''
          bigPictureStr += '<h1 class="book-class">' + categories + '</h1>'
        bookcollectionsInstance.models.forEach(function(modelData){
          bigPictureStr += '<div class="col-xs-4 col-sm-3 column-container">'

          var bookLink = modelData.get('imageLinks')
            var bookImage = modelData.attributes.imageLinks.thumbnail
          bigPictureStr += '<img class="book-image" src="' + bookImage + '"/>'
          bigPictureStr += '<p class="book-title">' + modelData.attributes.title + '</p>'
          bigPictureStr += '</div>'
        })
               contentArea.innerHTML = bigPictureStr
      })
   },

   showHomePage: function(){

      var categoryListings = [
         {catName: "Fiction" , subcatList: ['Drama','Literature','Mystery', 'Poetry','Romance'] },
         {catName: "Nonfiction" ,   subcatList: ['Biography', 'Business', 'Education', 'Health', 'Philosophy', 'Self-Help'] },
         {catName: "Miscellaneous" ,   subcatList: ['Cooking','Crafts','Espanol', 'Medicine'] }
      ]
          bigStr = ''

          for(var a = 0; a < categoryListings.length; a += 1){
            bigStr += '<div class="col-sm-4">'
            bigStr +=   '<h2><a href="#/books/'+ categoryListings[a].catName +'">' + categoryListings[a].catName + '</a></h2>'
            bigStr +=   '<ol class="book-category">'

            for(var i = 0; i < categoryListings[a].subcatList.length; i += 1){
                bigStr += '<li class="hash-changer"><a href="#/books/'+ categoryListings[a].catName.toLowerCase() + '/' +categoryListings[a].subcatList[i].toLowerCase() +'">' +  categoryListings[a].subcatList[i] + '</a></li>'

            }
            bigStr += '</ol>'
            bigStr += '</div>'
          }
          contentArea.innerHTML = bigStr

    },

   initialize: function(){

      Backbone.history.start()
   },
})

var app = new AppRouter()
