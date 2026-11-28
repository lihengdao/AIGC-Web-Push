# Cursor Service / HyperFrames 可选同步工具

仅在确实需要把本包的 `geo-viz/` 镜像到 Cursor Service 时使用。一般用户安装/使用 Remotion 地理技能不需要运行此脚本。

脚本默认只执行 `rsync` dry-run。若要真正同步，必须指定目标绝对路径：

```bash
HYPERFRAMES_GEO_VIZ_DIR=/absolute/path/to/cursor-config/skills/geo-viz \
  ./integrations/cursor-service/sync-to-hyperframes.sh --dry-run
```

确认 dry-run 输出的目标路径和变更清单正确、备份目标目录后，才运行 `--apply`。真正同步会使用 `rsync --delete`，并要求手动输入 `SYNC`；目标目录中不属于该技能的文件会被删除。不要在未检查目标路径时运行。
