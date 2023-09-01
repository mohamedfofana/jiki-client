export interface IDialogData {
  title: string;
  body: string;
  withActionButton: boolean;
  okColor: "warn" | "primary",
  cancelButtonText: string;
  actionButtonText: string;

}
