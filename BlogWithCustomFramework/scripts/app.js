(function () {

    // Create your own kinvey application

    let baseUrl = "https://baas.kinvey.com";
    let appKey = "kid_r1Lmav0r"; // Place your appKey from Kinvey here...
    let appSecret = "44104793bdd74ec8ae36b79a3ce67fa4"; // Place your appSecret from Kinvey here...
    let _guestCredentials = "283d1fc1-3ff7-4e8a-8711-0e571c8aee68.BLLBrIwTRkM2jU0wrW6Du1FFSc18hrmTQQXBNcXqncs="; // Create a guest user using PostMan/RESTClient/Fiddler and place his authtoken here...

    //Create AuthorizationService and Requester
    let selector = ".wrapper";
    let mainContentSelector = ".main-content";

    let authService = new AuthorizationService(baseUrl,appKey,appSecret,_guestCredentials);
    authService.initAuthorizationType("Kinvey");
    let request = new Requester(authService);
    // Create HomeView, HomeController, UserView, UserController, PostView and PostController
    
    let homeView = new HomeView(selector,mainContentSelector)
    let homeController = new HomeController(homeView, request, baseUrl, appKey)

    let userView = new UserView(selector, mainContentSelector)
    let userController = new UserController(userView, request, baseUrl, appKey)
    
    let postView = new PostView(selector,mainContentSelector)
    let postController = new PostController(postView, request, baseUrl, appKey)
    
    
    
    
    initEventServices();

    onRoute("#/", function () {
        // Check if user is logged in and if its not show the guest page, otherwise show the user page...
        if(authService.isLoggedIn()){
            homeController.showUserPage()
        }else {
            homeController.ShowGuestPage()
        }
    });

    onRoute("#/post-:id", function () {
        // Create a redirect to one of the recent posts...
        let top = $("#post-" + this.params['id']).position().top;
        $(window).scrollTop(top);
    });

    onRoute("#/login", function () {
        // Show the login page...
        userController.showLoginPage(authService.isLoggedIn());
    });

    onRoute("#/register", function () {
        // Show the register page...
        userController.showRegisterPage(authService.isLoggedIn());
    });

    onRoute("#/logout", function () {
        // Logout the current user...
        userController.logout();
    });

    onRoute('#/posts/create', function () {
        // Show the new post page...
        let data = {
            fullname: sessionStorage['fullname']
        };
        postController.showCreatePostPage(data, authService.isLoggedIn());
    });

    bindEventHandler('login', function (ev, data) {
        // Login the user...
        userController.login(data)
    });

    bindEventHandler('register', function (ev, data) {
        // Register a new user...
        userController.register(data)
    });

    bindEventHandler('createPost', function (ev, data) {
        // Create a new post...
        postController.createNewPost(data)
    });

    run('#/');
})();
