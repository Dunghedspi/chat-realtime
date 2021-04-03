export default function ModalUser() {
  return (
    <div class="Modal-Background toggle-Modal">
      <div
        class="Center-Block Absolute-Center is-Fixed is-Variable Modal"
        id="Fixed-Modal"
      >
        <div class="Center-Content">
          <h4 class="Title">Absolute Center.</h4>

          <p>
            This box is absolutely centered within the viewport, horizontally
            and vertically, using only CSS.
          </p>

          <p>
            <a href="#" class="Shaw-Button trigger-Resize">
              Resize Me!
            </a>
          </p>

          <p>
            <a href="#" class="Shaw-Button toggle-Modal">
              Close Modal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
