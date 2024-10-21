import $ from "jquery";

export function toggleSidebar(isSidebarOpen) {
    if (isSidebarOpen) {
      $(".sidebar").removeClass("closed"); 
      $(".sidebar").css({ left: "0", transition: "all 0.3s ease" });
      $(".main").css({ marginLeft: "250px", width: "calc(100% - 250px)", transition: "all 0.3s ease" });
    } else {
      $(".sidebar").addClass("closed"); 
      $(".sidebar").css({ left: "-250px", transition: "all 0.3s ease" });
      $(".main").css({ marginLeft: "60px", width: "calc(100% - 60px)", transition: "all 0.3s ease" }); // Adjust main content width when sidebar is closed
    }
  }
