import { BaseController } from "@/core/domain/controller";
import type { TControllerRequest, TControllerResponse } from "@/core/domain/types";
import type { IRegisterRequest, IRegisterResponse, TLoginRequest, TLoginResponse } from "@/modules/auth/dto";
import { AuthService } from "@/modules/auth/services";
import type { Nullable } from "@/modules/common/types";
import type { UserModel } from "@/modules/user/models";

export class AuthController extends BaseController {
	public async login(request: TControllerRequest<TLoginRequest, TLoginResponse>, response: TControllerResponse<TLoginResponse>): Promise<void> {
		const validated: boolean = this.validate(request, response);
		if (!validated) return;

		try {
			const authService: AuthService = new AuthService();
			const token: Nullable<string> = await authService.login(request.body);

			if (!token) {
				this.handleException(response, "Invalid Credentials", 401);
				return;
			}

			this.sendResponse("success", response, { token });
		} catch (exception) {
			this.handleException(response, exception);
		}
	}

	public async register(request: TControllerRequest<IRegisterRequest, IRegisterResponse>, response: TControllerResponse<IRegisterResponse>): Promise<void> {
		const validated: boolean = this.validate(request, response);
		if (!validated) return;

		try {
			const authService: AuthService = new AuthService();
			const user: string | UserModel = await authService.register(request.body);

			if (typeof user === "string") {
				this.handleException(response, user, 400);
				return;
			}

			this.sendResponse("success", response, { user });
		} catch (exception) {
			this.handleException(response, exception);
		}
	}
}
