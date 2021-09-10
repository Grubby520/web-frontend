<!--
  dialog
  包含form表单，提交接口
-->

<template>
  <SlDialog
    title="title"
    :visible.sync="show"
    :width="dialogWidth"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :append-to-body="true"
    :before-close="close"
    @cancel="close"
    @closed="closed"
  >
    <div>
      <el-alert
        class="mb-2rem"
        title="请务必确保此发货单对应的物流单号填写正确，物流单号填写错误或者未填写则仓库无法签收此包裹！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <el-form
        class="delivery-form mb-16px"
        ref="deliveryForm"
        :model="form"
        :rules="rules"
        :validate-on-rule-change="false"
        label-width="100px"
        inline
      >
        <el-form-item label="物流商" prop="logisticsCompanyId">
          <el-select
            v-model="form.logisticsCompanyId"
            placeholder="物流商"
            filterable
            clearable
            @change="companyChangeHandler"
          >
            <el-option
              v-for="(item,index) in companyOptions"
              :key="'opt_'+index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNumber">
          <el-input
            v-model="form.logisticsNumber"
            placeholder="物流单号"
            maxlength="32"
            show-word-limit
            clearable
            :disabled="!form.logisticsCompanyId || isSelfSend"
          ></el-input>
        </el-form-item>
      </el-form>
      <SlTableInfo
        :isEmbedTable="true"
        :tableData="tableData"
        :columns="columns"
        headerAlign="left"
        max-height="320px"
      ></SlTableInfo>
    </div>
    <template #bottom>
      <el-button @click="close">{{$t('button.cancelText')}}</el-button>
      <el-button
        type="primary"
        :loading="handleLoading"
        :disabled="handleLoading"
        @click="handleSubmit"
      >{{$t('button.enterText')}}</el-button>
    </template>
    <!-- Dialog -->
  </SlDialog>
</template>
<script>
import OemGoodsAPI from '@api/oemGoods'
import { emptyValidator, wCharsValidator } from '@shared/validate'
export default {
  name: 'ReissueDialog',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isSelfSend () {
      let selectedlogisticsCompany = this.companyOptions.find(item => item.value === parseInt(this.form.logisticsCompanyId))
      return selectedlogisticsCompany && selectedlogisticsCompany.courierCode === 'self-delivery'
    },
    rules () {
      let rules = {
        logisticsCompanyId: [
          emptyValidator('请选择物流商', ['blur', 'change'])
        ],
        logisticsNumber: [emptyValidator('请填写物流单号'), wCharsValidator('仅支持数字、字母、下划线')]
      }
      if (this.isSelfSend) { // '自发'的情况可以不校验物流单号
        delete rules.logisticsNumber
      }
      return rules
    }
  },
  data () {
    return {
      title: '发货明细',
      handleLoading: false,
      dialogWidth: '60%',
      columns: [
        {
          name: 'purchaseOrderNumber',
          label: '生产订单号'
        }, {
          name: 'skuImage',
          label: '商品图片',
          isImage: true,
          data: {
            imgSize: '6rem'
          }
        }, {
          name: 'skuCode',
          label: 'SKU编码'
        }, {
          name: 'commodityName',
          label: '商品名称'
        }, {
          name: 'attributesName',
          label: '销售属性'
        }, {
          name: 'price',
          label: '单价'
        }, {
          name: 'requireQuantity',
          label: '待补发数量'
        }
      ],
      form: {
        logisticsCompanyId: null,
        logisticsNumber: null
      },
      companyOptions: [],
      emptyValidator
    }
  },
  mounted () {
    this.getCompanyOPtions()
  },
  methods: {
    getCompanyOPtions () {
      OemGoodsAPI.getLogisticsCompany().then(res => {
        let { data = [] } = res
        this.companyOptions = data.map(item => {
          return {
            label: item.logisticsCompanyName,
            value: item.id,
            courierCode: item.courierCode
          }
        })
      })
    },
    companyChangeHandler () {
      this.form.logisticsNumber = null
      this.$refs.deliveryForm.clearValidate('logisticsNumber')
    },
    handleSubmit () {
      this.$refs.deliveryForm.validate(valid => {
        if (valid) {
          this.handleLoading = true
          const supplementIdList = this.tableData.map(item => item.id)
          OemGoodsAPI.supplement({
            ...this.form,
            supplementIdList
          }).then(({ success }) => {
            if (success) {
              this.$message.success('发货成功！')
              this.close()
              this.$emit('submited')
            }
          }).catch(() => {
            this.handleLoading = false
          })
        }
      })
    },
    close () {
      this.$emit('update:show', false)
    },
    closed () {
      this.handleLoading = false
      this.$refs.deliveryForm.resetFields()
    }
  }
}
</script>