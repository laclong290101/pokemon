import { $ } from "../ultil";
import swal from "sweetalert";
export default class login {
  async render() {
    $(".point").style.visibility = "hidden";
    return `
                <div class="container-fluid">
                    <div class="container" >
                            <div class="col-8 mx-auto">
                                <form id="submit">
                                  <div class="d-flex">
                                    <label for="" class="w-25">Nhập tên:</label>
                                    <input type="text" id="userName" class="form-control">
                                  </div>
                                  <div class="d-flex justify-content-end mt-2">  
                                    <button type="submit" class="btn btn-success" style="background-color: red">Bắt đầu</button> 
                                  </div>
                                </form>                  
                          </div>
                      </div>
                  </div>
        `;
  }
  async afterRender() {
    $("#submit").addEventListener("submit", (e) => {
      e.preventDefault();
      if ($("#userName").value == "") {
        swal({
          text: "Bạn chưa nhập tên!",
        });
      } else if ($("#userName").value.length < 3) {
        swal({
          text: "Bạn phải nhập hơn 3 kí tự",
        });
      }
      else {
        const userName = $("#userName").value;
        localStorage.setItem("user", userName);
        window.location.hash = "/games";
      }
    });
  }
}
