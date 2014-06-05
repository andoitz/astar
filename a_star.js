var aStar = {
	config:{s:0,d:0,board:0,cols:0,rows:0,div:0,blocks:0},
	init:function(config){
		//Guardamos configuración
		$.extend(this.config,config);
		this.config.s={x:this.config.s[0],y:this.config.s[1],p:-1,g:-1,h:-1,f:-1};
		this.config.d={x:this.config.d[0],y:this.config.d[1],p:-1,g:-1,h:-1,f:-1};
		//Intentamos creación de una tabla con ruta posible hasta 10 veces
		for(var i=0;i<10;i++){
			this.virtualTable();
			if(this.calculate().length>0) break;
		}
		if(i==10) alert("No hay ruta posible");
		this.drawTable();
	},
	virtualTable:function(){
		for(var x=0;x<this.config.cols;x++){//X=COL
			this.config.board[x]=[];
			for(var y=0;y<this.config.rows;y++){//Y=ROW
				var square = Math.floor(Math.random()*(100/this.config.blocks)); //Probabilidad de ser obstaculo = 25%
				this.config.board[x][y] = square ? 0 : 1; //0 = abierto, 1 = obstaculo
			}
		}
		this.config.board[this.config.s.x][this.config.s.y] = 0; 
		this.config.board[this.config.d.x][this.config.d.y] = 0;
	},
	calculate:function(){
		//Nodos abiertos y nodos cerrados
		var o=[],c=[];
		//Coste actual, Coste heuristico, Coste inicio-destino usando g
		var g=0,h=Math.pow(this.config.s.x-this.config.d.x,2)+Math.pow(y=this.config.s.y-this.config.d.y,2),f=g+h;
		o.push(this.config.s);//Nodo inicial en la lista de nodos
		//Seguir siempre que nos queden nodos abiertos
		while(o.length>0){
			//Buscar el mejor nodo abierto
			var bc=o[0].f,bn=0;
			for(var i=1;i<o.length;i++) if(o[i].f<bc) bc=o[i].f,bn=i;
			//Nuestro mejor nodo actual
			var cn=o[bn];
			//Comprobar si se ha llegado al destino
			if(cn.x==this.config.d.x && cn.y==this.config.d.y){
				var path=[this.config.d];//Ruta con el nodo destino

				//Recrear el camino
				while(cn.p != -1){
					cn=c[cn.p];
					path.unshift(cn);
				}
				return path;
			}
			//Eliminar nodo actual de la lista de nodos abiertos
			o.splice(bn,1);
			c.push(cn);//Ahora es un nodo cerrado
			//Buscamos nodo en las 8 direcciones
			for(var nn_x=Math.max(0,cn.x-1);nn_x<=Math.min(this.config.cols-1,cn.x+1);nn_x++){
				for(var nn_y=Math.max(0,cn.y-1);nn_y<=Math.min(this.config.rows-1,cn.y+1);nn_y++){
					rs=this.testNode(cn,nn_x,nn_y,c,o);
					if(rs.b) continue; o=rs.o;
				}
			}
			
		}
		return [];
	},
	drawTable:function(){
		//Dibujamos la tabla
		for (var y=0;y<this.config.rows;y++){
			for (var x=0;x<this.config.cols;x++){
				$("#"+this.config.div).append("<div id='board_"+x+"_"+y+"' class='cell "+(this.config.board[x][y] == 0 ? "abierto" : "obstaculo")+"'></div>");
			}
			$("#"+this.config.div).append("<div class='clear'></div>");
		}
		//Botones
		$("#"+this.config.div).append("<div id='bar'><input type='button' value='Mostrar Ruta' id='mostrar' onclick='aStar.resolver()' /></div>");
		//Inicio y Fin
		$("#board_"+this.config.s.x+"_"+this.config.s.y).addClass("inicio");
		$("#board_"+this.config.d.x+"_"+this.config.d.y).addClass("fin");
	},
	resolver:function(){
		//Calculamos con algoritmo A*
		var path = this.calculate();
		 //Marcamos ruta calculada
		for(var i=0;i<path.length;i++) $("#board_"+path[i].x+"_"+path[i].y).addClass("esRuta");
	},
	testNode:function(cn,nn_x,nn_y,c,o){
		var rs={o:o,b:false};
		//Nuevo nodo está abierto o nuevo nodo es el destino
		if(this.config.board[nn_x][nn_y]==0||(this.config.d.x==nn_x && this.config.d.y==nn_y)){
			//Comprobar si el nodo está en la lista de nodos cerrados
			var fc=false;
			for(var i in c){
				if(c[i].x==nn_x && c[i].y==nn_y){
					fc=true; break;//Cerrado
				}
			}
			if(fc){
				rs.b=true;
				return rs;//Saltamos Nodo
			}
			//Comprobar si está en nuestra lista de nodos abiertos
			var fo=false;
			for(var i in rs.o){
				if(rs.o[i].x==nn_x && rs.o[i].y==nn_y){
					fo=true; break;//Abierto
				}
			}
			//Nodo no encontrado en la lista de abiertos
			if(!fo){
				var nn={x:nn_x,y:nn_y,p:c.length-1,g:-1,h:-1,f:-1};
				
				nn.g=cn.g+Math.floor(Math.sqrt(Math.pow(nn.x-cn.x,2)+Math.pow(nn.y-cn.y,2)));
				nn.h=Math.pow(nn.x-this.config.d.x,2)+Math.pow(y=nn.y-this.config.d.y,2);
				nn.f=nn.g+nn.h;
				rs.o.push(nn);
			}
		}
		return rs;
	}
}