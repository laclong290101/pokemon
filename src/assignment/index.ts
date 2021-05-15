import Navbar from "../component/navbar";
import { $, reRender } from "../ultil";
import swal from "sweetalert";

export default class assignment {
  async render() {
    let listImg: string = "";

    const pokemons: number = 10;

    interface PokemonInterface {
      id: number;
      image: string;
    }

    let arrPokemon: PokemonInterface[] = [];

    for (let i = 1; i <= pokemons; i++) {
      let data: any = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      let pokemon: any = await data.json();
      arrPokemon = [
        ...arrPokemon,
        { id: pokemon.id, image: pokemon.sprites.front_default },
      ];
    }

    const cardPokemon: any = arrPokemon.concat(arrPokemon);

    cardPokemon.sort(() => {
      return Math.random() - 0.5;
    });

    cardPokemon.forEach((item: any, index: number) => {
      listImg += `
      <div class=" col-3 mb-3" >
        <article class="flashcard" id="flashcard_${index}" >
          <input type="checkbox" id="idInput_${index}" data-focus="${item.id}" index="${index}" checked class="pokeEle"/>
          <label for="idInput_${index}">
            <section class="front">
            </section>
            <section class="back">
            <img src="${item.image}" height="150px">
            </section>
          </label>
        </article>
      </div>
      `;
    });

    $("#navbar").innerHTML = await Navbar.render();
    $(".point").innerHTML = "Điểm: 0";
    return `${listImg}`;
  }

  async afterRender() {
    let focusPokemon: HTMLElement[] = [];
    let totalPoint: number = 0;
    let countToEnd: number = 0;
    const userName: string = localStorage.getItem("user");
    const pokeList: HTMLInputElement[] = $(".pokeEle");

    const starttingMinutes = 2;
    let time = starttingMinutes * 60;
    const countdownpkm = $('#countdown');
    setInterval(updateCountdown, 1000);
    function updateCountdown() {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;
      // seconds = seconds < 10 ? '0' + seconds : seconds;
      countdownpkm.innerHTML = `${minutes} : ${seconds}`;
      time--;
    }
    // var counter = 0;
    // var timeleft = 120;
    // var countdown = $('#countdown');
    // function convertSeconds(s) {
    //   var min = Math.floor(s / 60);
    //   var sec = s % 60;
    //   return min + ':' + sec;
    // }
    // function setup() {
    //   countdown.innerHTML = convertSeconds(timeleft - counter)
    // }
    // function timeIt() {
    //   counter++;
    //   countdown.innerHTML = convertSeconds(timeleft - counter)
    // }
    // setInterval(timeIt, 1000);

    setTimeout(() => {
      for (let i = 0; i < pokeList.length; i++) {
        $(`#flashcard_${i} .pokeEle`).checked = false;
      }
      swal("Trò chơi bắt đầu");
    }, 2000);

    // Play Game

    pokeList.forEach((item: HTMLInputElement) => {
      item.addEventListener("click", () => {
        focusPokemon = [...focusPokemon, item];

        if (focusPokemon.length === 2) {
          if (
            focusPokemon[0].getAttribute("data-focus") == focusPokemon[1].getAttribute("data-focus") &&
            focusPokemon[0].getAttribute("index") != focusPokemon[1].getAttribute("index")
          ) {
            focusPokemon.map((ele: HTMLInputElement) => {
              setTimeout(() => {
                $(`#flashcard_${ele.getAttribute("index")}`).style.display = "none";
              }, 1500);
            });

            totalPoint += 100;
            countToEnd += 1;
            time += 10;

          } else {
            focusPokemon.map((ele: HTMLInputElement) => {
              const isCheched = $(`#${ele.id}`);
              $(`#flashcard_${ele.getAttribute("index")}`);
              isCheched.parentNode.classList.add("bounce");
              console.log(isCheched);
              console.log(ele.id);

              setTimeout(() => {
                isCheched.parentNode.classList.remove("bounce");
                isCheched.checked = false;
              }, 1300);
            });
            if (totalPoint > 0) {
              totalPoint -= 50;
            }
          }

          focusPokemon = [];

          $(".point").innerHTML = "Điểm: " + totalPoint;
        }

        if (countToEnd === 10) {
          swal(
            "Chúc mừng!",
            `${userName} đã dành chiến thắng với số điểm là: ${totalPoint}`
          );

          swal({
            title: "Bạn có muốn chơi lại",
            text: "Click outside to cancel",
            icon: "warning",
            dangerMode: false,
          }).then(async (willDelete: boolean) => {
            if (willDelete) {
              swal("Chơi lại thành công", {
                icon: "success",
              });
              reRender(Assignment, "#content");
            } else {
              swal("Bạn đã hủy!");
            }
          });
        } else if (time === 0) {
          swal(
            `${userName} đã thua cuộc do hết thời gian`
          );

          swal({
            title: "Bạn có muốn chơi lại",
            text: "Click outside to cancel",
            icon: "warning",
            dangerMode: false,
          }).then(async (willDelete: boolean) => {
            if (willDelete) {
              swal("Chơi lại thành công", {
                icon: "success",
              });
              reRender(Assignment, "#content");
            } else {
              swal("Bạn đã hủy!");
            }
          });
        }
      });
    });

    // play again
    const Assignment = new assignment();
    const restartBtn: HTMLElement = $("#navbar .restart");
    restartBtn.addEventListener("click", async function () {
      swal({
        title: "Bạn chắc chắn muốn chơi lại",
        text: "Click outside to cancel",
        icon: "warning",
        dangerMode: true,
      }).then(async (willDelete: boolean) => {
        if (willDelete) {
          swal("Chơi lại thành công", {
            icon: "success",
          });
          reRender(Assignment, "#content");
        } else {
          swal("Bạn đã hủy!");
        }
      });
    });

    // Đăng xuất game
    const logoutBtn: HTMLElement = $("#navbar .logout");
    logoutBtn.addEventListener("click", async function () {
      localStorage.removeItem("user");
      $("#navbar").innerHTML = "";
      window.location.hash = "";
    });
  }


}
