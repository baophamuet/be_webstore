'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', 
      [
      {
        name: 'iPhone 15 Pro Max',
        category_id: 4,
        description: 'Flagship Apple smartphone',
        price: '1299',
        stock: 50,
        created_at: new Date(),
        updated_at: new Date()
      },
       {
        name: 'Samsung Galaxy S24 Ultra',
        category_id: 4,
        description: 'High-end Android smartphone',
        price: '1199',
        stock: 30,
        created_at: new Date(),
        updated_at: new Date()
      },


      // Áo
      {
        name: 'Áo Thun Nam Cổ Tròn Màu Đen Logo Studio',
        category_id: 1,
        description: 'Áo thun cotton đen, in logo trắng đơn giản, form regular fit.',
        price: 350,
        stock: 100,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20250429_3BMvDxHErD.jpeg?v=1745909083',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250429_ZT47hre25b.jpeg?v=1745909086',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250429_anaYEKSuzJ.jpeg?v=1745909104'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Áo Thun Nữ Cổ V Màu Cam Surf',
        category_id: 1,
        description: 'Áo thun nữ cổ V màu cam, hoạ tiết surf chủ đề biển, cotton mềm.',
        price: 300,
        stock: 80,
        images: JSON.stringify([
          'https://bizweb.dktcdn.net/thumb/1024x1024/100/366/703/products/a03-2.jpg?v=1748323626020',
          'https://bizweb.dktcdn.net/thumb/1024x1024/100/366/703/products/a03-1.jpg?v=1749727156573',
          'https://bizweb.dktcdn.net/thumb/1024x1024/100/366/703/products/a03-3.jpg?v=1748323628267'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Áo phông Nam Nâu Vintage',
        category_id: 1,
        description: 'Áo phông màu nâu đất vintage, chất liệu cotton dày.',
        price: 400,
        stock: 60,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20250415_8qqbq5FT2h.jpeg?v=1744686401',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250415_h20s7tQJIJ.jpeg?v=1744686566',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250415_4XjQLKDq9O.jpeg?v=1744686490'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Quần
      {
        name: 'Quần Jean Nam Slim Fit Xanh Đậm',
        category_id: 2,
        description: 'Quần jean nam slim fit denim xanh đậm co giãn nhẹ, form ôm vừa.',
        price: 550,
        stock: 70,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20250519_hGxVPGNoZW.jpeg?v=1747629429',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250519_4boPB5g0wr.jpeg?v=1747629444',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250519_RLY5JI3TrS.jpeg?v=1747629433'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Quần Jean Rách Form Straight Fit',
        category_id: 2,
        description: 'Quần jean rách nhẹ, straight fit, denim washed grey cá tính.',
        price: 600,
        stock: 50,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20240722_rWAwZQ0QlV.jpeg?v=1721614636',
          'https://pos.nvncdn.com/fa2431-2286/ps/20240722_NJRaLrsfiB.jpeg?v=1721614645',
          'https://pos.nvncdn.com/fa2431-2286/ps/20240722_Dacm9IWTYR.jpeg?v=1721614642'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Quần Jogger Nam Kaki Xám',
        category_id: 2,
        description: 'Quần jogger kaki xám, thun eo và gấu, chất nhẹ và thoải mái.',
        price: 400,
        stock: 90,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20240822_DECRKnpR9p.jpeg?v=1724309530',
          'https://pos.nvncdn.com/fa2431-2286/ps/20240822_M4Xx2GgwVb.jpeg?v=1724309537',
          'https://pos.nvncdn.com/fa2431-2286/ps/20240822_Dp6ceoMUM6.jpeg?v=1724309535'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Giày
      {
        name: 'Sneaker Nam Trắng Cơ Bản',
        category_id: 3,
        description: 'Giày sneaker trắng minimal, lót êm, dễ phối đồ hàng ngày.',
        price: 1200,
        stock: 40,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_f5V5aqflFx.jpeg?v=1735966252',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_51suPHnTSx.jpeg?v=1735966246',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_oXpaJnvScZ.jpeg?v=1735966239',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_w50l4jNOKG.jpeg?v=1735966249'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Giày Thể Thao Reebok Nam',
        category_id: 3,
        description: 'Reebok sneaker màu phối hợp, form classic, phù hợp chạy bộ nhẹ.',
        price: 1300,
        stock: 30,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_0spdocsSBW.jpeg?v=1735965982',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_5Joow3TToR.jpeg?v=1735965972',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_BMb4op41CZ.jpeg?v=1735965979'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Giày chelsea Boots',
        category_id: 3,
        description: 'Sneaker phối da nâu & vải canvas, phong cách casual cao cấp.',
        price: 1500,
        stock: 25,
        images: JSON.stringify([
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_9v5kWdzYlD.jpeg?v=1735965690',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_CpBQfOyozX.jpeg?v=1735965687',
          'https://pos.nvncdn.com/fa2431-2286/ps/20250104_d3zO6kyaCA.jpeg?v=1735965684'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
      , {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
