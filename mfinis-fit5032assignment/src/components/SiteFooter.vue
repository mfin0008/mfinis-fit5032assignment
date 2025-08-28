
<template>
  <div class="footer-component">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6 col-xxl-3 mt-3 text-center">
          Having fun?
          <br/> Check out our socials!
          <br/>
          <img class="socials-logo" src="../assets/instagram-logo.png"/>
          <img class="socials-logo" src="../assets/facebook-logo.png"/>
          <img class="socials-logo" src="../assets/x-logo.png"/>
          <img class="socials-logo" src="../assets/tiktok-logo.png"/>
        </div>
        <div class="col-12 col-md-6 col-xxl-3 mt-3 text-center">
          <img src="../assets/flags.webp"/>
        </div>
        <div class="d-none d-xxl-inline col-xxl-6 acknowledgement ">
          We acknowledge the Traditional Owners of the land on which we live, work, and play,
          and pay our respects to Elders past and present.
          We recognise and celebrate the enduring connection of
          Aboriginal and Torres Strait Islander peoples to land, waters, and culture.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  height: 8vh;
  width: auto;
  margin: 0.5em 0.5em;
}
.socials-logo {
  height: 3vh;
  width: auto;
}
.footer-component {
  background-color: var(--color-neutral);
  color: var(--color-secondary);
  font-size: 2vh;
  font-weight: 600;
}
.acknowledgement {
  font-size: 1.5vh;
  font-weight: normal;
  text-align: justify;
  margin-top: 1.5vh;
}
</style>
