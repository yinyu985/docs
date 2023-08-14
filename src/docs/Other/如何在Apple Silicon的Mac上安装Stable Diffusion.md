# 如何在Apple Silicon的Mac上安装Stable Diffusion

有四个可选项，我只讲最后的AUTOMATIC1111的Stable Diffusion有web-ui的版本，分析一下各自特点

| 选项                                     | 特点                             |
| ---------------------------------------- | -------------------------------- |
| Diffusers                                | 最容易安装，但功能不多。         |
| Draw Things                              | 最容易安装，具有一组很好的功能。 |
| DiffusionBee                             | 易于安装，但功能较少。           |
| AUTOMATIC1111/*stable*-*diffusion*-webui | 最好的功能，但安装起来有点困难。 |

第一步打开终端，如果你没有安装homebrew，去homebrew的官网就能找到一键安装的脚本了

然后开始使用homebrew安装

```bash
brew install cmake protobuf rust python@3.10 git wget
```

将github仓库克隆到当前mac用户的家目录

```bash
cd ~ && git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
```

会在家目录下创建一个新的文件夹`stable-diffusion-webui`

然后你需要下载基础的model才能够运行 Stable Diffusion，你可以在[这里](https://stable-diffusion-art.com/models/#Stable_diffusion_v15)下载到模型。

将下载到的模型移动到`~/stable-diffusion-webui/models/Stable-diffusion`

然后通过脚本就能运行了

```
cd ~/stable-diffusion-webui;./webui.sh
```

然后打开浏览器访问`http://127.0.0.1:7860/`就可以开始愉快的作图了。

参考引用：[https://stable-diffusion-art.com/install-mac/](https://stable-diffusion-art.com/install-mac/)