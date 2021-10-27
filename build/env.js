//  环境变量配置
module.exports = {
  isProd: process.env.NODE_ENV === 'production',
  outputDir: process.env.outputDir || 'dist',
  projectPath: process.env.projectPath || 'todo1',
  assetsPath: process.env.assetsPath || 'static'
}
