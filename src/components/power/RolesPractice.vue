<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18" v-for="item3 in item2.children" :key="item3.id">
                    <el-tag type="warning">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
        <span>
          <el-form ref="addRoleFormRef" :model="addRoleForm" label-width="100px">
            <el-form-item label="角色名称">
              <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="addRoleForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改角色对话框 -->
      <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
        <span>
          <el-form ref="editRoleFormRef" :model="editRoleForm" label-width="100px">
            <el-form-item label="角色名称">
              <el-input v-model="editRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="editRoleForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      addDialogVisible: false,
      addRoleForm: {
        roleName: 'blank',
        roleDesc: 'THIS IS A TEST'
      },
      editDialogVisible: false,
      editRoleForm: {}
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      this.roleList = res.data
    },

    // 添加角色
    async addRole() {
      const { data: res } = await this.$http.post('roles', {
        roleName: this.addRoleForm.roleName,
        roleDesc: this.addRoleForm.roleDesc
      })
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败！')
      }
      this.$message.success('添加成功！')
      this.addDialogVisible = false
      this.getRoleList()
    },

    // 展示修改角色对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$http.error('获取角色信息失败！')
      }
      this.editRoleForm = res.data
      this.editDialogVisible = true
    },

    // 修改角色信息，点击确认按钮后提交
    async editRole() {
      const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
        roleName: this.editRoleForm.roleName,
        roleDesc: this.editRoleForm.roleDesc
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败！')
      }
      this.$message.success('修改成功！')
      this.editDialogVisible = false
      this.getRoleList()
    },

    // 删除角色
    async deleteRole(id) {
      // console.log(id)
      // 弹出确认对话框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }

      // 点击确认按钮后，调用API接口进行删除操作
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getRoleList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

// TDDO: 添加tag边框线，观察是否解决标签排版混乱的问题（三级权限和二级权限混在一起）
</style>
