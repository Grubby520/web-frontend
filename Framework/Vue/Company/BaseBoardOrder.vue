<!--
 search + table
-->
<template>
  <div class="pending-delivery">
    <SlListView
      @gotoPage="gotoPage"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
    >
      <div solt="search">
        <SlSearchForm
          v-model="query"
          :items="searchItems"
          :loading="tableLoading"
          @reset="gotoPage(page.pageSize)"
          @search="gotoPage(page.pageSize)"
        ></SlSearchForm>

        <SlTableInfo :tableData="tableData" :columns="columns" headerAlign="left"></SlTableInfo>
      </div>
    </SlListView>
  </div>
</template>

<script>
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'BaseBoardOrder',
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      query: {},
      searchItems: [
        {
          type: 'input',
          label: '生产订单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'input',
          label: '底版供应商',
          name: 'supplierName'
        },
        {
          type: 'date',
          label: '下单日期',
          name: 'timeAts',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      tableLoading: false,
      tableData: [],
      columns: [
        {
          name: 'purchaseOrderNumber',
          label: '订单号'
        },
        {
          name: 'skuCode',
          label: '底版SKU'
        }, {
          name: 'skuImage',
          label: '图片',
          isImage: true,
          data: {
            imgSize: '6rem'
          }
        }, {
          name: 'name',
          label: '商品名称'
        }, {
          name: 'attributesName',
          label: '销售属性'
        }, {
          name: 'basePlateSupplierName',
          label: '底版供应商'
        }, {
          name: 'requireQuantity',
          label: '订单数量'
        }, {
          name: 'deliveryQuantity',
          label: '实际发货数'
        }, {
          name: 'inInventoryQuantity',
          label: '入库数量'
        }, {
          name: 'statusName',
          label: '状态'
        }, {
          name: 'orderTime',
          label: '下单时间'
        }
      ]
    }
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.tableLoading = true
      OemGoodsAPI.basePlateOrderList(params).then(res => {
        if (res.success) {
          const data = res.data || {}
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    generateParams (pageSize, pageIndex) {
      let { timeAts = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        orderTimeStart: timeAts && timeAts[0] ? timeAts[0] : '',
        orderTimeEnd: timeAts && timeAts[1] ? timeAts[1] : ''
      }
    }
  }
}
</script>
