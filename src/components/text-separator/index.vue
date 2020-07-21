<template>
  <el-dialog title="输入关键字" :visible.sync="showMe" :modal="false" width="600px" @close="hideMe">
      <el-form ref="form" :model="form" :rules="formRules">
        <el-form-item label="关键字" prop="words">
          <el-input v-model="form.words" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="分隔符" prop="separator">
          <el-input v-model="form.separator"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideMe">取消</el-button>
        <el-button type="primary" @click="convertText">确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'textSeparator',
  props: {
    show: {
      type: Boolean
    },
    parentData: {
      type: Object,
      default: () => {}
    }
  },
  data(){
    return {
      form: {
        words: '',
        separator: ''
      },
      formRules: {
        words: [
          {required: true, message: '请输入关键字', trigger: 'blur'}
        ],
        separator: [
          {required: true, message: '请输入分隔符', trigger: 'blur'}
        ]
      }
    };
  },

  computed: {
    showMe: {
      get (){
        return this.show;
      },

      set(){
        this.hideMe();
      }
    }
  },

  methods: {
    hideMe(){
      this.$emit('hide');
    },
    convertText(){
      this.$refs['form'].validate((valid) => {

        if(valid) {
          /** 去除换行 */
          const words = this.form.words.replace(/\n/g, '');
          const separator = this.form.separator.trim();

          const wds = words.split(separator).map((item) => {
            return item.trim();
          }).filter((item) => {
            /** 去除空白字符串 */
            return item !== '';
          });

          this.$emit('get-convert-words', {
            parentData: this.parentData,
            words: wds
          });

          /** 重置 */
          this.form.words = '';
          this.form.separator = '';

          /** 关闭 */
          this.hideMe();

        }

      });
    }
  }
}
</script>
