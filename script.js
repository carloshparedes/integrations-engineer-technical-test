
// script.js
require('dotenv').config();

function createValidation() {
  const frontImage = $('#frontImage')[0].files[0];
  const reverseImage = $('#reverseImage')[0].files[0];

  if (!frontImage || !reverseImage) {
    alert('Por favor, carga ambas imágenes.');
    return;
  }

  const formData = new FormData();
  formData.append('frontImage', frontImage);
  formData.append('reverseImage', reverseImage);
  formData.append('type', 'document-validation');
  formData.append('country', 'CO');
  formData.append('document_type', 'national-id');
  formData.append('user_authorized', true);

  $('#loadingMessage').show();
  $('#retryButton').hide();
  $.ajax({
    url: process.env.API_ENDPOINT, //add API Server and the end point
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      'Truora-API-Key': process.env.TRUORA_API_KEY //add the api key
    },
    success: function (response) {
      console.log(response);
      $('#retryButton').show();
      $('#validationResults').html('La validación de tu documento está: ' + response.validation_status);
      $('#loadingMessage').hide();



      const frontUrl = response.instructions.front_url;
      const reverseUrl = response.instructions.reverse_url;

      $.ajax({
        url: frontUrl,
        type: 'PUT',
        data: frontImage,
        processData: false,
        contentType: false,
        headers: {
          'Truora-API-Key': 'api_key', //add the api key
          'Accept': 'application/json'
        },
        success: function (response) {
          console.log('Imagen frontal cargada con éxito');
        },
        error: function (error) {
          console.log('Error al cargar la imagen frontal');
        }
      });


      $.ajax({
        url: reverseUrl,
        type: 'PUT',
        data: reverseImage,
        processData: false,
        contentType: false,
        headers: {
          'Truora-API-Key': 'api_key', // add the api key
          'Accept': 'application/json'
        },
        success: function (response) {
          console.log('Imagen trasera cargada con éxito');
        },
        error: function (error) {
          console.log('Error al cargar la imagen trasera');
        }
      });


    },
    error: function (error) {
      console.log(error);
      $('#validationResults').html('Error en la validación del documento. Por favor, inténtalo de nuevo.');
      $('#retryButton').show();
    }
  });
}
