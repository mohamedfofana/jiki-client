export interface IDialogData {
  title: string;
  body: string;
  confirmed?: boolean;
  okColor: "warn" | "primary",
  cancelButtonText: string;
  okButtonText: string;

}
