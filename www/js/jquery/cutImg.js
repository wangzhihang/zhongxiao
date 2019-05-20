		  // 按钮点击
		  $('.cropperWrap').off("click").on('click', '[data-method]', function () {
			    var $image = $('#img');
			    var $download = $('#confirm');
			    var uploadedImageType = 'image/jpeg';
				var $this = $(this);
				var data = $this.data();
				var cropper = $image.data('cropper');
				var cropped;
				var $target;
				var result;

				if ($this.prop('disabled') || $this.hasClass('disabled')) {
				  return;
				}

				if (cropper && data.method) {
				  data = $.extend({}, data); // Clone a new one

				  if (typeof data.target !== 'undefined') {
					$target = $(data.target);

					if (typeof data.option === 'undefined') {
					  try {
						data.option = JSON.parse($target.val());
					  } catch (e) {
						console.log(e.message);
					  }
					}
				  }

				  cropped = cropper.cropped;

				  switch (data.method) {
					case 'rotate':
					  if (cropper.cropped) {
						$image.cropper('clear');
					  }

					  break;

					case 'getCroppedCanvas':
					  if (uploadedImageType === 'image/jpeg') {
						if (!data.option) {
						  data.option = {};
						}

						data.option.fillColor = '#fff';
					  }

					  break;
				  }

				  result = $image.cropper(data.method, data.option, data.secondOption);

				  switch (data.method) {
					case 'rotate':
					  if (cropped) {
						$image.cropper('crop');
					  }

					  break;

					case 'scaleX':
					case 'scaleY':
					  $(this).data('option', -data.option);
					  break;

					case 'getCroppedCanvas':
					  if (result) {
						  //获取图片
						  $('.step_03').hide();
						  $('.picWrap').html('<img src="'+result.toDataURL("image/jpeg",0.7)+'">');
						  $('.step_02').show();
						  uploadImg(result.toDataURL("image/jpeg",0.7));
//						if (!$download.hasClass('disabled')) {
//						  $download.attr('href', result.toDataURL(uploadedImageType));
//						}
					  }

					  break;

					case 'destroy':
					  if (uploadedImageURL) {
						URL.revokeObjectURL(uploadedImageURL);
						uploadedImageURL = '';
						$image.attr('src', originalImageURL);
					  }

					  break;
				  }

				  if ($.isPlainObject(result) && $target) {
					try {
					  $target.val(JSON.stringify(result));
					} catch (e) {
					  console.log(e.message);
					}
				  }

				}
			  });