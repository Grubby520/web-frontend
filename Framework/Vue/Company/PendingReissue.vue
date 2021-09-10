<!--
  search+table+dialog
  table包含checkbox
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
        <SlTableToolbar>
          <SlButton
            :disabled="multipleSelection.length === 0"
            type="primary"
            boxShadow="primary"
            @click="onDeliverGoods"
          >发货</SlButton>
        </SlTableToolbar>
        <SlTableInfo
          :tableData="tableData"
          :columns="columns"
          :multiple="true"
          @selection-change="handleSelectionChange"
          headerAlign="left"
        ></SlTableInfo>
      </div>
    </SlListView>
    <!-- 收货/查看 Dialog -->
    <ReissueDialog :show.sync="visible" :tableData="multipleSelection" @submited="gotoPage" />
  </div>
</template>
<script>
import OemGoodsAPI from '@api/oemGoods'
import ReissueDialog from './pendingReissue/ReissueDialog.vue'
export default {
  name: 'PendingReissue',
  components: {
    ReissueDialog
  },
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
          type: 'batch-input',
          label: '生产订单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'input',
          label: 'SKU编码',
          name: 'skuCode'
        },
        {
          type: 'input',
          label: '商品名称',
          name: 'commodityName'
        }
      ],
      tableLoading: false,
      tableData: [],
      columns: [
        {
          name: 'purchaseOrderNumber',
          label: '生产订单号'
        },
        {
          name: 'skuCode',
          label: 'SKU编码'
        }, {
          name: 'skuImage',
          label: '商品图片',
          isImage: true,
          data: {
            imgSize: '6rem'
          }
        }, {
          name: 'commodityName',
          label: '商品名称'
        }, {
          name: 'attributesName',
          label: '销售属性'
        }, {
          name: 'qualityNumber',
          label: '质检单号'
        }, {
          name: 'sourceDeliveryOrderNumber',
          label: '源发货单号'
        }, {
          name: 'price',
          label: '单价'
        }, {
          name: 'requireQuantity',
          label: '需补发数量'
        }
      ],
      multipleSelection: [],
      // dialog
      visible: false
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.tableLoading = true
      OemGoodsAPI.awaitShipmentsList(params).then(res => {
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
      return {
        ...this.query,
        pageIndex,
        pageSize
      }
    },
    onDeliverGoods () {
      if (!this.multipleSelection.length) {
        this.$message.warning('先选择SKU，再点击发货！')
        return
      }
      this.visible = true
    }
  }
}
</script>