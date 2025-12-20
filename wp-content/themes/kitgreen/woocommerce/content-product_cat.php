<div <?php wc_product_cat_class(); ?>>
	
	<div class="category-content">

			<?php do_action( 'woocommerce_before_subcategory', $category ); ?>
			<div class="product-category-thumbnail">
				<?php
					do_action( 'woocommerce_before_subcategory_title', $category );
				?>
			</div>
            <div class="inner">
            <h6 class="name-inner">
                <?php 
                    echo esc_html( $category->name );
                 ?>
            </h6>
            </div>
	
		<?php do_action( 'woocommerce_after_subcategory', $category ); ?>
	</div>
</div>